import { exec } from 'child_process';
import {
  userSeeds,
  operatorSeeds,
  playerSeeds,
  groupSeeds,
  sessionSeeds,
  voucherSeeds,
  disputeSeeds,
  alertSeeds,
  machineSeeds,
} from './seeds';

const configPath: string = './dist/ormconfig.js';

const typeormArguments: string = process.argv
  .slice(2)
  .map(args => args.replace('\\', ''))
  .join(' ');

let cmd: string;
switch (typeormArguments) {
  case 'createDB': {
    cmd = `typeorm query "CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME} CHARACTER SET utf8 COLLATE utf8_general_ci " -f ${configPath}`;
    break;
  }
  case 'dropDB': {
    if (process.env.NODE_ENV !== 'Development') {
      process.stderr.write('Drop DB can only be done on Development environment?');
      process.exit();
    }

    cmd = `typeorm query "DROP DATABASE IF EXISTS ${process.env.DB_NAME}" -f ${configPath}`;
    break;
  }
  case 'seed': {
    if (process.env.NODE_ENV !== 'Development') {
      process.stderr.write('Seeding can only be done on Development environment?');
      process.exit();
    }

    let query = '';

    /* for (const u of userSeeds) {
      query += `INSERT INTO user (id, first_name, last_name, email, password, phone, recover_password_token, status, is_deleted, create_date, update_date) VALUES (${u.id},
       '${u.first_name}', '${u.last_name}', '${u.email}', '${u.password}', '${u.phone}',
        '${u.recover_password_token}', '${u.state}', ${u.is_deleted}, '${u.create_date}', '${u.update_date}'); `;
    }

    for (const o of operatorSeeds) {
      query += `INSERT INTO operator (id, name, status, api_connector_id, api_access_token, api_token_expiration_date, regulation, create_date, update_date) VALUES (${o.id},
       '${o.name}', '${o.status}', '${o.api_connector_id}', '${o.api_access_token}',
        '${o.api_token_expiration_date}', '${o.regulation}', '${o.create_date}', '${o.update_date}');`;
    }

    for (const p of playerSeeds) {
      query += `INSERT INTO player (cid, status, bets, wins, net_cash, last_session_date, settings, create_date, update_date, operator_id) VALUES ('${p.cid}',
       '${p.status}', ${p.bets}, ${p.wins}, ${p.net_cash}, '${p.last_session_date}', '${p.settings}', '${p.create_date}', '${p.update_date}', ${p.operator_id});`;
    }

    for (const m of machineSeeds) {
      query += `INSERT INTO machine (serial, status, configuration,
       is_deleted, create_date, update_date, secret, camera_id, controller_ip, name, status_update_date, last_diagnostic_date, id, location) VALUES ('${m.serial}',
       '${m.status}', '${m.configuration}', ${m.is_deleted}, '${m.create_date}',
        '${m.update_date}', '${m.secret}', '${m.camera_id}', ${m.controller_ip}, '${m.name}',
         '${m.status_update_date}', '${m.last_diagnostic_date}', ${m.id}, '${m.location}');`;
    }

    for (const g of groupSeeds) {
      query += `INSERT INTO \`group\` (denomination, regulation, is_private, stack_size, status, idle_timeout, scatter_round_size, number_of_players_alert,
       is_deleted, create_date, update_date, name, operator_id, grace_timeout,
        id) VALUES (${g.denomination}, '${g.regulation}', ${g.is_private}, ${g.stack_size}, '${g.status}', ${g.idle_timeout},
         ${g.scatter_round_size}, ${g.number_of_players_alert}, ${g.is_deleted},
         '${g.create_date}', '${g.update_date}', '${g.name}', ${g.operator_id}, ${g.grace_timeout}, ${g.id});`;
    }

    for (const s of sessionSeeds) {
      query += `INSERT INTO session (id, session_description, player_ip, rounds, duration, viewer_duration, queue_duration,
       total_winning, total_net_cash, total_bets, total_stacks_used, currency, client_version, os, device_type, browser, secret, status, configuration,
        is_deleted, create_date, update_date, player_cid, group_id, machine_id)
         VALUES (${s.id}, '${s.session_description}', ${s.player_ip}, ${s.rounds}, ${s.duration}, ${s.viewer_duration},
          ${s.queue_duration}, ${s.total_winning}, ${s.total_net_cash}, ${s.total_bets}, ${s.total_stacks_used}, '${s.currency}',
           '${s.client_version}', '${s.os}', '${s.device_type}', '${s.browser}', '${s.secret}', '${s.status}', '${s.configuration}', ${s.is_deleted},
            '${s.create_date}', '${s.update_date}', '${s.player_cid}', ${s.group_id}, ${s.machine_id});`;
    }

    for (const v of voucherSeeds) {
      query += `INSERT INTO voucher (id, status, operator_id, revocation_reason, create_date, update_date, expiration_date, player_cid, group_id)
       VALUES (${v.id}, '${v.status}', ${v.operator_id},
        '${v.revocation_reason}', '${v.create_date}', '${v.update_date}', '${v.expiration_date}', '${v.player_cid}', ${v.group_id});`;
    }

    for (const d of disputeSeeds) {
      query += `INSERT INTO dispute (id, status, rebate_sum, rebate_currency, create_date, update_date, closed_date, complaint,
       discussion, operator_id, player_cid, session_id)
        VALUES (${d.id}, '${d.status}', ${d.rebate_sum}, '${d.rebate_currency}', '${d.create_date}',
         '${d.update_date}', '${d.closed_date}', '${d.complaint}', '${d.discussion}', ${d.operator_id}, '${d.player_cid}', ${d.session_id});`;
    } */

    for (const a of alertSeeds) {
      query += `INSERT INTO alert (id, status, type, source,
       severity, create_date, update_date, description, additional_information, is_flagged)
        VALUES (${a.id}, '${a.status}', '${a.type}', '${a.source}', '${a.severity}', '${a.create_date}',
         '${a.update_date}', '${a.description}', '${a.additional_information}', ${a.is_flagged});`;
    }

    cmd = `typeorm query "${query}" -f ${configPath} -c SEED`;
    break;
  }
  default: {
    cmd = `typeorm ${typeormArguments} -f ${configPath}`;
    break;
  }
}

/* eslint-disable no-console */
console.log(cmd);
exec(
  cmd,
  { env: process.env },
  (error, stdout, stderr) => {
    error && console.log(error);
    stdout && process.stdout.write(stdout);
    stderr && process.stderr.write(stderr);
    if (error || stderr) {
      process.exit(1);
    }
  },
);
/* eslint-enable no-console */
