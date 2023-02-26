import { v4 as uuidv4 } from 'uuid';
import { ICarouselSettings } from '../../components/Carousel/Carousel';
import { IGameRulesScreen } from './types';
import screen1 from '../../assets/images/gameRules/screen1.png';
import screen6 from '../../assets/images/gameRules/screen6.png';
import screen10 from '../../assets/images/gameRules/screen10.jpg';
import screen11 from '../../assets/images/gameRules/screen11.png';
import screen12 from '../../assets/images/gameRules/screen12.png';
import screen13 from '../../assets/images/gameRules/screen13.png';
import screen14 from '../../assets/images/gameRules/screen14.png';
import screen15 from '../../assets/images/gameRules/screen15.png';
import screen16 from '../../assets/images/gameRules/screen16.png';
import screen17 from '../../assets/images/gameRules/screen17.png';
import screen18 from '../../assets/images/gameRules/screen18.png';
import screen19 from '../../assets/images/gameRules/screen19.png';
import screen20 from '../../assets/images/gameRules/screen20.jpg';
import screen21 from '../../assets/images/gameRules/screen21.jpg';

export const GAME_RULES_CAROUSEL_SETTINGS: Partial<ICarouselSettings> = {
  dots: false,
  infinite: false,
};

export const gameRulesScreens: IGameRulesScreen[] = [
  {
    id: uuidv4(),
    title: 'GameRules.Screen1.Title',
    image: screen1,
    content: 'GameRules.Screen1.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen2.Title',
    content: 'GameRules.Screen2.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen3.Title',
    content: 'GameRules.Screen3.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen4.Title',
    content: 'GameRules.Screen4.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen5.Title',
    content: 'GameRules.Screen5.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen6.Title',
    image: screen6,
    content: 'GameRules.Screen6.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen7.Title',
    content: 'GameRules.Screen7.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen8.Title',
    content: 'GameRules.Screen8.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen9.Title',
    content: 'GameRules.Screen9.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen10.Title',
    image: screen10,
    content: 'GameRules.Screen10.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen11.Title',
    image: screen11,
    content: 'GameRules.Screen11.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen12.Title',
    image: screen12,
    content: 'GameRules.Screen12.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen13.Title',
    image: screen13,
    content: 'GameRules.Screen13.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen14.Title',
    image: screen14,
    content: 'GameRules.Screen14.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen15.Title',
    image: screen15,
    content: 'GameRules.Screen15.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen16.Title',
    image: screen16,
    content: 'GameRules.Screen16.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen17.Title',
    image: screen17,
    content: 'GameRules.Screen17.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen18.Title',
    image: screen18,
    content: 'GameRules.Screen18.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen19.Title',
    image: screen19,
    content: 'GameRules.Screen19.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen20.Title',
    image: screen20,
    content: 'GameRules.Screen20.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen21.Title',
    image: screen21,
    content: 'GameRules.Screen21.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen22.Title',
    content: 'GameRules.Screen22.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen23.Title',
    content: 'GameRules.Screen23.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen24.Title',
    content: 'GameRules.Screen24.Content',
  },
  {
    id: uuidv4(),
    title: 'GameRules.Screen25.Title',
    content: 'GameRules.Screen25.Content',
  },
];
