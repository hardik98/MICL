import React from 'react';
import { useLocation } from 'react-router-dom';
import PlayersList from '../../components/moduler/PlayersList/PlayersList';
// import { useSoldPlayerMutation } from '../../redux/api/playersApi';

function Home() {
  const location = useLocation();
  const { path } = location.state || {};
  // const handleClick = async () => {
  //   await soldPlayer({
  //     id: '2',
  //     updatedPlayer: {
  //       id: '2',
  //       name: 'Suresh Verma',
  //       battingStyle: 'Right Hand Bat',
  //       bowlingStyle: '-',
  //       runs: '400',
  //       average: '20.23',
  //       wickets: '-',
  //       economy: '-',
  //       basePoints: '100',
  //       prevTeams: 'Kings',
  //       photo: '/assets/Suresh_Varma.jpg',
  //       isSold: true,
  //     },
  //   });
  //   localStorage.setItem('sharedData', JSON.stringify({ message: 'Hello from Tab 1' }));
  // };

  return (
    <div
      className="home"
      style={{ maxHeight: 'calc(100vh - 120px)', overflow: 'scroll', padding: '12px' }}
    >
      <PlayersList path={path} />
    </div>
  );
}

export default Home;
