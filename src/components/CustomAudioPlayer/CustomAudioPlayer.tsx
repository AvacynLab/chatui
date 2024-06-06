import './CustomAudioPlayer.scss';
import React from 'react';
import { Icon } from '@iconify/react';

interface CustomAudioPlayerProps {
  audioBlob: Blob;
  onDelete: () => void;
}

const CustomAudioPlayer: React.FC<CustomAudioPlayerProps> = ({ audioBlob, onDelete }) => {
  const audioUrl = URL.createObjectURL(audioBlob);
  
  return (
    <div className="custom-audio-player">
      <audio controls controlsList="nodownload" src={audioUrl}></audio>
      <button className="delete-button" onClick={onDelete}>
        <Icon icon="mdi:delete" className="delete-icon" />
      </button>
    </div>
  );
};

export default CustomAudioPlayer;
