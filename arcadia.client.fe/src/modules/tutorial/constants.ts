import { v4 as uuidv4 } from 'uuid';
import { ICarouselSettings } from '../../components/Carousel/Carousel';
import { ITutorialScreen } from './types';
import tutorialScreen1Image from '../../assets/images/tutorial/screen1.png';
import tutorialScreen2Image from '../../assets/images/tutorial/screen2.png';
import tutorialScreen3Image from '../../assets/images/tutorial/screen3.png';
import tutorialScreen4Image from '../../assets/images/tutorial/screen4.png';
import tutorialScreen5Image from '../../assets/images/tutorial/screen5.png';

export const TUTORIAL_CAROUSEL_SETTINGS: Partial<ICarouselSettings> = {
  infinite: true,
};

export const tutorialScreens: ITutorialScreen[] = [
  {
    id: uuidv4(),
    image: tutorialScreen1Image,
    steps: [
      'Tutorial.Screen1.Step1',
      'Tutorial.Screen1.Step2',
      'Tutorial.Screen1.Step3',
    ],
  },
  {
    id: uuidv4(),
    image: tutorialScreen2Image,
    steps: [
      'Tutorial.Screen2.Step1',
      'Tutorial.Screen2.Step2',
      'Tutorial.Screen2.Step3',
      'Tutorial.Screen2.Step4',
    ],
  },
  {
    id: uuidv4(),
    image: tutorialScreen3Image,
    steps: [
      'Tutorial.Screen3.Step1',
      'Tutorial.Screen3.Step2',
    ],
  },
  {
    id: uuidv4(),
    image: tutorialScreen4Image,
    steps: [
      'Tutorial.Screen4.Step1',
      'Tutorial.Screen4.Step2',
    ],
  },
  {
    id: uuidv4(),
    image: tutorialScreen5Image,
    steps: [
      'Tutorial.Screen5.Step1',
      'Tutorial.Screen5.Step2',
      'Tutorial.Screen5.Step3',
      'Tutorial.Screen5.Step4',
      'Tutorial.Screen5.Step5',
    ],
  },
];
