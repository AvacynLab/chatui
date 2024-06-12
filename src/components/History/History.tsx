// History.tsx
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { loadChat, deleteChat } from '../../store/user/userSlice';
import { Icon } from '@iconify/react';

const History = () => {
  const dispatch = useDispatch();
  const history = useSelector((state: RootState) => state.user.chatHistory);

  const handleLoadChat = (sessionid: string) => {
    dispatch(loadChat({ sessionid }));
  };

  const handleDeleteChat = () => {
    dispatch(deleteChat());
  };

  return (
    <div className='history-container'>
      <h2 className='history-text'>Historique</h2>
      <ul className='history-list'>
        {history.map((session, index) => (
          session.sessionid ? (
            <li className='history-list-item' key={index} onClick={() => handleLoadChat(session.sessionid)}>
              <p className='history-text-item'>
                {session.sessionid}
                <span className='ellipsis'>...</span>
                <button className='delete-btn' onClick={(e) => { e.stopPropagation(); handleDeleteChat(); }}>
                  <Icon icon="entypo:circle-with-cross" />
                </button>
              </p>
            </li>
          ) : null
        ))}
      </ul>
    </div>
  );
};

export default History;
