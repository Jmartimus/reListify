import React from 'react';

interface ListMakerControlsProps {
  status: string;
  listMaking: boolean;
  listMakingCompleted: boolean;
  onListMake: () => void;
}

const ListMakerControls: React.FC<ListMakerControlsProps> = ({
  status,
  listMaking,
  listMakingCompleted,
  onListMake,
}) => {
  return (
    <div id="listMakerControls">
      <h2>Run ReListify</h2>
      <div id="statusContainer">
        <p id="statusTitle">ReListify status updates:</p>
        <div id="status">{status}</div>
        <button id="listMakerButton" onClick={onListMake} disabled={listMaking}>
          {listMakingCompleted
            ? 'Reload page'
            : listMaking
            ? 'List-making...'
            : 'Make list'}
        </button>
      </div>
    </div>
  );
};

export default ListMakerControls;
