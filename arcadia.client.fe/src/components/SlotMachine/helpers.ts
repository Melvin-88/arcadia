import { v4 as uuidv4 } from 'uuid';
import { SLOTS_COUNT, SLOT_ITEMS_COUNT } from './constants';
import { ISlot, ISlotItem } from './types';
import { PhantomValue, SlotMachineSlotIcon } from '../../types/phantomWidget';
import { PHANTOM_CHIP_SCATTER_ROUND_VALUE } from '../../constants';
import imgBar from '../../assets/images/slotMachine/bar.png';
import imgOrange from '../../assets/images/slotMachine/orange.png';
import imgApple from '../../assets/images/slotMachine/apple.png';
import imgLemon from '../../assets/images/slotMachine/lemon.png';
import imgStrawberry from '../../assets/images/slotMachine/strawberry.png';
import imgPlum from '../../assets/images/slotMachine/plum.png';
import imgAce from '../../assets/images/slotMachine/ace.png';
import imgSevenNumber from '../../assets/images/slotMachine/seven.png';
import imgCherry from '../../assets/images/slotMachine/cherry.png';
import imgBell from '../../assets/images/slotMachine/bell.png';

const SLOT_OPTIONS_MAP: {[key in SlotMachineSlotIcon]: string} = {
  [SlotMachineSlotIcon.bar]: imgBar,
  [SlotMachineSlotIcon.orange]: imgOrange,
  [SlotMachineSlotIcon.apple]: imgApple,
  [SlotMachineSlotIcon.lemon]: imgLemon,
  [SlotMachineSlotIcon.strawberry]: imgStrawberry,
  [SlotMachineSlotIcon.plum]: imgPlum,
  [SlotMachineSlotIcon.ace]: imgAce,
  [SlotMachineSlotIcon.seven]: imgSevenNumber,
  [SlotMachineSlotIcon.cherry]: imgCherry,
  [SlotMachineSlotIcon.bell]: imgBell,
};

const DEFAULT_IMG = SLOT_OPTIONS_MAP[SlotMachineSlotIcon.bar];

const SLOT_OPTIONS = Object.values(SLOT_OPTIONS_MAP);

const makeArrayFromNumber = (number: number) => Array.from(Array(number).keys());

export const generateSlotItems = (winOption: SlotMachineSlotIcon): ISlotItem[] => (
  makeArrayFromNumber(SLOT_ITEMS_COUNT).map((_, i) => {
    const id = uuidv4();

    if (i === 0) {
      return {
        id,
        image: SLOT_OPTIONS_MAP[winOption],
      };
    }

    return {
      id,
      image: SLOT_OPTIONS[Math.floor(Math.random() * SLOT_OPTIONS.length)],
    };
  })
);

export const preprocessData = (values: PhantomValue[], config: SlotMachineSlotIcon[], winValue: PhantomValue): {slots: ISlot[]} => {
  const uniqueValues = Array.from(new Set(values)).sort((a, b) => a - b);

  const optionsMap: {[key: number]: string} = {};

  uniqueValues.forEach((value) => {
    if (uniqueValues.includes(PHANTOM_CHIP_SCATTER_ROUND_VALUE) && value === PHANTOM_CHIP_SCATTER_ROUND_VALUE) {
      optionsMap[value] = config[config.length - 1];

      return;
    }

    optionsMap[value] = config[Object.keys(optionsMap).length - 1] || DEFAULT_IMG;
  });

  const slots = makeArrayFromNumber(SLOTS_COUNT).map(() => ({
    id: uuidv4(),
    items: generateSlotItems(optionsMap[winValue] as SlotMachineSlotIcon),
  }));

  return {
    slots,
  };
};
