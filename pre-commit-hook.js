const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');

const tasks = ['lint', 'test'];
const yellow = '\x1b[32m';
const red = '\x1b[31m';

childProcess.exec(
  'git status -s -uno',
  {},
  (error, stdout, stderr) => {
    error && console.error(red, error);
    stderr && console.error(red, stderr);
    if (error) {
      process.exit(1);
    }

    if (!stdout) {
      process.exit(0);
    }

    const regex = /(.*)(arcadia(.*?))\/(.*)/;
    const changedServices = stdout.split(' ')
      .reduce((filtered, file) => {
        if (!regex.test(file)) {
          return filtered;
        }

        const service = file.match(regex)[2];

        if (!filtered.has(service)) {
          console.log(yellow, `Changed service ${service}`);
          filtered.add(service);
        }
        return filtered;
      }, new Set());

    if (!changedServices.size) {
      process.exit(0);
    }

    const services = fs.readdirSync(__dirname, { withFileTypes: true })
      .reduce((filtered, directory) => {
        if (!directory.isDirectory() || !fs.existsSync(path.join(directory.name, 'package.json')) || !changedServices.has(directory.name)) {
          return filtered;
        }

        try {
          const servicePackage = JSON.parse(fs.readFileSync(path.join(directory.name, 'package.json')));
          tasks.map(task => {
            if (servicePackage.hasOwnProperty('scripts') && servicePackage.scripts.hasOwnProperty(task)) {
              filtered.push({ name: directory.name, run: [`npm run ${task}`] });
              return;
            }

            console.log(yellow, `Service ${service} should have ${tasks.join(',')} scripts. Please add it.`);
          });
        } catch (e) {
          return filtered;
        }

        return filtered;
      }, []);

    services.map(service => {
      console.log(yellow, `Service ${service.name} runing task ${service.run.join(' && ')}`);
      return tasks.push(
        childProcess.exec(
          service.run.join(' && '),
          { cwd: path.join(__dirname, service.name) },
          (error, stdout, stderr) => {
            if (error) {
              error && console.error(red, `${service.name}: ${error}`);
              stderr && console.error(red, `${service.name}: ${stderr}`);
              stdout && console.error(red, `${service.name}: ${stdout}`);
              process.exit(1);
            }
          },

        ),
      );
    });
  },
);
