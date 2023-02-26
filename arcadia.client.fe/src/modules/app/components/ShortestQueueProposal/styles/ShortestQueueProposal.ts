import { IStyle } from '@uifabric/styling';
import { classNamesFunction } from '@uifabric/utilities';
import { Color } from '../../../../../styles/constants';
import { groupCardColorsMap } from '../../../../../constants/group';
import { GroupColorId } from '../../../../../types/group';

export interface IShortestQueueProposalStyleProps {
  color: GroupColorId;
}

export interface IShortestQueueProposalStyles {
  root: IStyle;
  card: IStyle;
  closeBtn: IStyle;
  machineImg: IStyle;
  ribbon: IStyle;
  playImmediately: IStyle;
  queueInfoText: IStyle;
  playBtn: IStyle;
}

export const getStyles = ({ color }: IShortestQueueProposalStyleProps): IShortestQueueProposalStyles => ({
  root: {
    position: 'absolute',
    bottom: '14rem',
    right: '3rem',
  },
  card: {
    width: '40.8rem',
    color: Color.white,
    background: groupCardColorsMap[color],
  },
  closeBtn: {
    position: 'absolute',
    display: 'block',
    width: '6.3rem',
    right: '1.2rem',
    top: '1.62rem',
  },
  machineImg: {
    display: 'block',
    width: '21.4rem',
    margin: '0 auto',
    marginBottom: '3.4rem',
  },
  ribbon: {
    marginTop: '-3.5rem',
    width: 'calc(100% + 3rem)',
    marginLeft: '-1.5rem',
  },
  playImmediately: {
    fontSize: '3.3rem',
    textTransform: 'uppercase',
    padding: '1rem 3rem 0.64rem',
    lineHeight: '4.5rem',
  },
  queueInfoText: {
    fontSize: '2.4rem',
    margin: '1.5rem',
  },
  playBtn: {
    width: '30rem',
    color: Color.white,
    textTransform: 'uppercase',
  },
});

export const getClassNames = classNamesFunction<IShortestQueueProposalStyleProps, IShortestQueueProposalStyles>();
