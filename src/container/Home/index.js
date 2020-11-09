import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className='home'>
      <ul>
        <li>
          <Link to='/linkage'>复杂联动</Link>
        </li>
        <li>
          <Link to='/layout'>复杂布局</Link>
        </li>
      </ul>
    </div>
  )
}

export default Home;