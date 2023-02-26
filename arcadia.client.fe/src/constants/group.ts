import { Color } from '../styles/constants';
import { GroupColorId } from '../types/group';

export const groupCardColorsMap: { [key in GroupColorId]: string } = {
  [GroupColorId.darkBlue]: Color.groupColor[GroupColorId.darkBlue],
  [GroupColorId.lightGreen]: Color.groupColor[GroupColorId.lightGreen],
  [GroupColorId.mentolGreen]: Color.groupColor[GroupColorId.mentolGreen],
  [GroupColorId.orange]: Color.groupColor[GroupColorId.orange],
  [GroupColorId.purple]: Color.groupColor[GroupColorId.purple],
  [GroupColorId.red]: Color.groupColor[GroupColorId.red],
  [GroupColorId.yellow]: Color.groupColor[GroupColorId.yellow],
};
