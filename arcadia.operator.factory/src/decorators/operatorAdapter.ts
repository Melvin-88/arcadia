import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { OPERATOR_ADAPTER_TAG } from '../constants/operator.tags';

export const OperatorAdapter: (operatorTag: string) => CustomDecorator = tag => SetMetadata(OPERATOR_ADAPTER_TAG, tag);