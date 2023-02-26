import { IRawStyle, IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color, FontFamily, Time } from '../../../styles/constants';
import { CircleSection, ICircleSectionsVisibilityMap } from '../types';

export interface IIdleTimeoutIndicatorStyleProps {
  className?: string;
  secondsLength: number;
  circleSectionsVisibilityMap: ICircleSectionsVisibilityMap;
  isDisabled?: boolean;
}

export interface IIdleTimeoutIndicatorStyles {
  root: IStyle;
  container: IStyle;
  timer: IStyle;
  seconds: IStyle;
  hourglassImg: IStyle;
  title: IStyle;
  circleSection1: IStyle;
  circleSection2: IStyle;
  circleSection3: IStyle;
  circleSection4: IStyle;
  circleSection5: IStyle;
  circleSection6: IStyle;
}

const basicCircleSectionStyles: IRawStyle = {
  position: 'absolute',
  top: '5%',
  left: '5%',
  width: '90%',
  opacity: 0,
  visibility: 'hidden',
  transition: `opacity ${Time.defaultAnimationTime}s, visibility ${Time.defaultAnimationTime}s`,
};

const progressCircleSectionVisibleStyles: IRawStyle = {
  opacity: 1,
  visibility: 'visible',
};

export const getStyles = ({
  className,
  secondsLength,
  circleSectionsVisibilityMap,
  isDisabled,
}: IIdleTimeoutIndicatorStyleProps): IIdleTimeoutIndicatorStyles => ({
  root: [
    {
      transition: `filter ${Time.defaultAnimationTime}s`,
    },
    isDisabled && {
      filter: 'grayscale(100%)',
    },
    className,
  ],
  circleSection1: [
    basicCircleSectionStyles,
    {
      clipPath: 'polygon(50% 0, 49% 10%, 16% 26%, 0 0)',
      '-webkit-clip-path': 'polygon(50% 0, 49% 10%, 16% 26%, 0 0)',
    },
    circleSectionsVisibilityMap[CircleSection.first] && progressCircleSectionVisibleStyles,
  ],
  circleSection2: [
    basicCircleSectionStyles,
    {
      clipPath: 'polygon(0 7%, 42% 51%, 27% 100%, 0 100%)',
      '-webkit-clip-path': 'polygon(0 7%, 42% 51%, 27% 100%, 0 100%)',
    },
    circleSectionsVisibilityMap[CircleSection.second] && progressCircleSectionVisibleStyles,
  ],
  circleSection3: [
    basicCircleSectionStyles,
    {
      clipPath: 'polygon(34% 85%, 67% 86%, 74% 100%, 25% 100%)',
      '-webkit-clip-path': 'polygon(34% 85%, 67% 86%, 74% 100%, 25% 100%)',
    },
    circleSectionsVisibilityMap[CircleSection.third] && progressCircleSectionVisibleStyles,
  ],
  circleSection4: [
    basicCircleSectionStyles,
    {
      clipPath: 'polygon(61% 55%, 100% 61%, 93% 86%, 72% 100%)',
      '-webkit-clip-path': 'polygon(61% 55%, 100% 61%, 93% 86%, 72% 100%)',
    },
    circleSectionsVisibilityMap[CircleSection.forth] && progressCircleSectionVisibleStyles,
  ],
  circleSection5: [
    basicCircleSectionStyles,
    {
      clipPath: 'polygon(100% 9%, 49% 51%, 100% 61%)',
      '-webkit-clip-path': 'polygon(100% 9%, 49% 51%, 100% 61%)',
    },
    circleSectionsVisibilityMap[CircleSection.fifth] && progressCircleSectionVisibleStyles,
  ],
  circleSection6: [
    basicCircleSectionStyles,
    {
      clipPath: 'polygon(50% 0, 100% 0, 100% 10%, 52% 47%)',
      '-webkit-clip-path': 'polygon(50% 0, 100% 0, 100% 10%, 52% 47%)',
    },
    circleSectionsVisibilityMap[CircleSection.sixth] && progressCircleSectionVisibleStyles,
  ],
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    fontFamily: FontFamily.tertiary,
    color: Color.white,
  },
  timer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  hourglassImg: {
    width: '5.2rem',
    marginRight: '1.3rem',
  },
  seconds: {
    display: 'flex',
    alignItems: 'center',
    height: '8rem',
    fontSize: `${9.3 - (secondsLength <= 1 ? 0 : (secondsLength * 1.85))}rem`,
    lineHeight: '1',
    backgroundClip: 'text',
    backgroundImage: 'linear-gradient(to top, #dff8ff, #ffffff), linear-gradient(to bottom, #ffffff, #ffffff)',
    '-webkit-text-stroke': `0.05em ${Color.idleTimeoutProgressIndicator.textStrokeColor}`,
    '-webkit-background-clip': 'text',
    overflow: 'visible',
  },
  title: {
    marginTop: '0.4rem',
    fontSize: '2.95rem',
    fontFamily: FontFamily.tertiary,
    textAlign: 'center',
    color: Color.idleTimeoutProgressIndicator.titleColor,
    '-webkit-text-stroke': `0.05em ${Color.idleTimeoutProgressIndicator.textStrokeColor}`,
  },
});

export const getClassNames = classNamesFunction<IIdleTimeoutIndicatorStyleProps, IIdleTimeoutIndicatorStyles>();
