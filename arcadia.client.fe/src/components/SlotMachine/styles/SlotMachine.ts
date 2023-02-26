import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../styles/constants';
import { forceMinAspectRatio, hexToRGBA } from '../../../styles/helpers';

export interface ISlotMachineStyleProps {
  className?: string;
}

export interface ISlotMachineStyles {
  root: IStyle;
  slotMachineImg: IStyle;
  slot: IStyle;
  slotInner: IStyle;
  slotImgContainer: IStyle;
  slotImg: IStyle;
  blurImage: IStyle;
  winLabelContainer: IStyle;
  winLabel: IStyle;
}

export const getStyles = ({ className }: ISlotMachineStyleProps): ISlotMachineStyles => ({
  root: [
    forceMinAspectRatio(648, 434),
    {
      width: '100%',
    },
    className,
  ],
  slotMachineImg: {
    display: 'block',
    maxWidth: '100%',
  },
  slot: {
    position: 'absolute',
    top: '31%',
    height: '47%',
    width: '20%',
    overflow: 'hidden',
  },
  slotInner: {
    height: '100%',
  },
  slotImgContainer: {
    height: '100%',
    padding: '2rem',
    display: 'flex',
    alignItems: 'center',
  },
  slotImg: {
    display: 'block',
    maxWidth: '100%',
  },
  blurImage: {
    filter: 'blur(1.2px) opacity(80%)',
  },
  winLabelContainer: {
    position: 'absolute',
    left: '13%',
    top: '28%',
    textAlign: 'center',
    height: '54%',
    width: '74%',
    background: hexToRGBA(Color.white, 0.5),
    border: '3px solid #eac840',
    boxShadow: `0 0 15px ${hexToRGBA(Color.black, 0.9)}`,
    borderRadius: '1.6rem',
    padding: '2rem 2.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  winLabel: {
    fontWeight: 600,
    backgroundImage: 'linear-gradient(to top, #fff000, #fed088, #ffea5d, #ffffff), linear-gradient(to bottom, #ffbf24, #ffbf24)',
    color: Color.slotMachine.winColor,
    backgroundClip: 'text',
    paintOrder: 'stroke fill',
    '-webkit-text-stroke': `0.05em ${Color.slotMachine.winStrokeColor}`,
    '-webkit-background-clip': 'text',
    '-webkit-text-fill-color': 'transparent',
  },
});

export const getClassNames = classNamesFunction<ISlotMachineStyleProps, ISlotMachineStyles>();
