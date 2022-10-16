import { useState, useEffect } from 'react'
import { getProfile } from '../services/spotify'


const Profile = ({ code }) => {
  const [profile, setProfile] = useState({name:'', image:''});
  useEffect(() => {
    getProfile(code)
    .then(returnedProfile=> {
      const newProfile = {
        'image': returnedProfile.images[0].url,
        'name': returnedProfile.display_name
      }
      setProfile(newProfile)
    })
  }, [code, setProfile])
    return (
      <div className='profile'>
        <div id="prof_img_holder">
          <img
            src={profile.image}
            alt='Profile'
            className='profile_img'
          />
        </div>
        <div id="prof_text_holder">
          Logged in as {profile.name}.
        </div>
      </div>
    );
}

export default Profile;
