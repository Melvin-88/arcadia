export enum CircleSection {
  first,
  second,
  third,
  forth,
  fifth,
  sixth,
}

export type ICircleSectionsVisibilityMap = {
  [key in CircleSection]: boolean
};
