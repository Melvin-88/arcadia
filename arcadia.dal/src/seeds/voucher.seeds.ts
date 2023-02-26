export const voucherSeeds = [
  {
    id: 1,
    status: 'pending',
    operator_id: 1,
    revocation_reason: 'Revocation test',
    create_date: '2020-05-05 11:49:52',
    update_date: '2020-05-05 12:21:00',
    expiration_date: '2020-05-08 14:49:40',
    player_cid: '11',
    group_id: 1,
  },
  {
    id: 2,
    status: 'revoked',
    operator_id: 1,
    revocation_reason: 'Test',
    create_date: '2020-05-06 11:49:52',
    update_date: '2020-05-06 12:21:00',
    expiration_date: '2020-05-09 14:49:40',
    player_cid: '11',
    group_id: 1,
  },
];
