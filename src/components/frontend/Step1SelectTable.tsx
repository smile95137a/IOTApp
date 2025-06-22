import React from 'react';
import { useDispatch } from 'react-redux';
import {
  setStep,
  setStore,
  setTable,
} from '@/store/slices/frontend/bookingStepSlice';
import tableEnableImg from '@/assets/image/iot-table-enable.png';
import tableDisableImg from '@/assets/image/iot-table-disable.png';

interface Props {
  store: any;
  tables: any[];
}

const Step1SelectTable: React.FC<Props> = ({ store, tables }) => {
  const dispatch = useDispatch();
  const available = tables.filter((t) => !t.isUse).length;

  return (
    <>
      <div className="store-detail__table-summary">
        <p>桌數：{tables.length}桌</p>
        <p className="store__table-available">可用桌數：{available}桌</p>
      </div>

      <div className="store-detail__table-grid">
        {tables.map((table) => {
          const status =
            table.status === 'FAULT'
              ? 'fault'
              : table.isUse
              ? 'reserved'
              : 'available';

          const label =
            status === 'fault'
              ? '設備維護中'
              : status === 'reserved'
              ? '開局進行中'
              : '立即開台';

          return (
            <div
              key={table.id}
              className="store-detail__table-item"
              onClick={() => {
                if (status === 'available') {
                  dispatch(setStore(store));
                  dispatch(setTable(table));
                  dispatch(setStep(2));
                }
              }}
            >
              <img
                src={status === 'available' ? tableEnableImg : tableDisableImg}
                alt={table.name}
                className="store-detail__table-img"
              />
              <div
                className={`store-detail__table-btn ${
                  status === 'available'
                    ? 'store-detail__table-btn--yellow'
                    : 'store-detail__table-btn--gray'
                }`}
              >
                {table.tableNumber} {label}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Step1SelectTable;
