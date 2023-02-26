import React from 'react';
import { IStyleFunctionOrObject, styled } from '@uifabric/utilities';
import GroupCard from './GroupCard/GroupCard';
import { GroupId, IGroups } from '../../types/group';
import {
  getClassNames, getStyles, IGroupsStyleProps, IGroupsStyles,
} from './styles/Groups';

export interface IGroupsProps extends Partial<IGroupsStyleProps> {
  styles?: IStyleFunctionOrObject<IGroupsStyleProps, IGroupsStyles>;
  groups: IGroups;
  onCardClick: (groupId: GroupId) => void;
}

const Groups: React.FC<IGroupsProps> = ({
  styles, className, groups, onCardClick,
}) => {
  const classNames = getClassNames(styles, { className });

  return (
    <div className={classNames.root}>
      {
        groups.map((group) => (
          <GroupCard
            key={group.groupId}
            group={group}
            onCardClick={onCardClick}
          />
        ))
      }
    </div>
  );
};

export default styled<IGroupsProps, IGroupsStyleProps, IGroupsStyles>(
  Groups,
  getStyles,
);
