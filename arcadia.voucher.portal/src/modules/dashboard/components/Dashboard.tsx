import React from 'react';
import { VouchersHeader } from './Header/VouchersHeader';
import { VouchersCommandBar } from './CommandBar/CommandBar';
import { VouchersFilters } from './Filters/VouchersFilters';
import { VouchersTable } from './Table/VouchersTable';
import { VoucherDialogForm } from './VoucherDialogForm/VoucherDialogForm';

const Dashboard = () => (
  <>
    <VouchersHeader />
    <VouchersCommandBar />
    <VouchersFilters />
    <VouchersTable />
    <VoucherDialogForm />
  </>
);

export default Dashboard;
