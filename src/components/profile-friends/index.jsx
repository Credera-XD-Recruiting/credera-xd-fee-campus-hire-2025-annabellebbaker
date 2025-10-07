import './style.css';
import { getFriendsListData } from '../../services/profile';
import { useQuery } from '@tanstack/react-query';

// object for the star icon - added for the topFriends icon
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="top-friend-icon"
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
      clipRule="evenodd"
    />
  </svg>
);

///------ HELPER FUNCTION -- this is a new const that will grab initials from a name --------///
// this will display if a profile picture is not showing up
const getInitials = name => {
  if (!name) return '?'; // if name doesn't appear, return the value when there is no name (return the string '?')

  const names = name.trim().split(' '); // breaking up the name to get initials, splitting into parts
  if (names.length === 1) return names[0].charAt(0).toUpperCase(); // handling single names (with no last name) -- just one initial
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase(); // formatting to upper case, this is handling full names
};

// object for the friends list, grabbing from the db.json
export const ProfileFriends = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['friends'],
    queryFn: getFriendsListData,
  });

  if (isLoading)
    return (
      <section id="profile-friends">
        <div className="content-card fade-in">
          <h2 className="page-heading-2">Friends</h2>
          <ul className="profile-friends-list">
            <li className="profile-list-item">
              <div className="profile-list-item-avatar loading"></div>
              <div className="profile-list-item-info">
                <div className="skeleton-block skeleton-block--half loading"></div>
                <div className="skeleton-block--quarter loading"></div>
              </div>
            </li>
            <li className="profile-list-item">
              <div className="profile-list-item-avatar loading"></div>
              <div className="profile-list-item-info">
                <div className="skeleton-block skeleton-block--half loading"></div>
                <div className="skeleton-block--quarter loading"></div>
              </div>
            </li>
            <li className="profile-list-item">
              <div className="profile-list-item-avatar loading"></div>
              <div className="profile-list-item-info">
                <div className="skeleton-block skeleton-block--half loading"></div>
                <div className="skeleton-block--quarter loading"></div>
              </div>
            </li>
            <li className="profile-list-item">
              <div className="profile-list-item-avatar loading"></div>
              <div className="profile-list-item-info">
                <div className="skeleton-block skeleton-block--half loading"></div>
                <div className="skeleton-block--quarter loading"></div>
              </div>
            </li>
          </ul>
        </div>
      </section>
    );

  // Access the nested [friends] array and use 'topFriend' property
  const friendsData = data?.friends?.[0]?.friends || data?.friends || [];

  // this is for the browser console to make sure it's grabbing the topFriends correctly ^^
  //console.log('Raw data:', data);
  //console.log('Friends array:', friends);

  //----- SORTING SECTION -- top friends first, and then by last name -----//
  const friends = [...friendsData].sort((a, b) => {
    // sorting it up!

    // top friends first!
    // Example: a = Stuart Raymond, b = Jamie Cowhan
    if (a.topFriend && !b.topFriend) return -1; // "a" is one parameter for a comparison function in the .sort() (#1 item)
    // "If Stuart IS a top friend AND Jamie is NOT, put Stuart first"
    if (!a.topFriend && b.topFriend) return 1; // "b" is the other compared parameter (#2 item)
    // if Stuart is NOT a top friend and Jamie is, put Jamie first
    // a comes before b (-1)
    // b comes before a (1)
    // 0 keeps current order

    // sort alphabetically by last name -- if both are top friends OR both are regular friends
    const lastNameA = (a.name || '').split(' ').pop().toLowerCase(); // added in (a.name || '') for safety checks just in case they don't have a profile picture!
    const lastNameB = (b.name || '').split(' ').pop().toLowerCase(); // same for here

    return lastNameA.localeCompare(lastNameB); // now compare them with results
  });

  /* updated this portion completely -- main change:
  - I was accessing the list as isTopFriend, but its topFriend in the db.json */
  return (
  <section id="profile-friends">
    <div className="content-card fade-in">
      <h2 className="page-heading-2">Friends</h2>
      <ul className="profile-friends-list">
        {friends.map((friend, index) => (
          <li
            className={`profile-list-item fade-in ${friend.topFriend ? 'top-friend' : ''}`}
            key={index}
          >
            <div className="profile-list-item-avatar">
              {friend.image ? (
                <img
                  src={friend.image}
                  onError={e => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.style.display = 'none';
                    const initialsDiv = e.currentTarget.nextElementSibling;
                    if (
                      initialsDiv &&
                      initialsDiv.classList.contains('avatar-initials')
                    ) {
                      initialsDiv.style.display = 'flex';
                    }
                  }}
                  alt={`Profile picture for ${friend.name}`}
                />
              ) : null}

              {/* Initials display */}
              <div 
                className="avatar-initials" 
                style={{ display: friend.image ? 'none' : 'flex' }}
              >
                {getInitials(friend.name)}
              </div>

              {/* Top friend star badge */}
              {friend.topFriend && (
                <div className="top-friend-indicator">
                  <StarIcon />
                </div>
              )}
            </div>
            
            <div className="profile-list-item-info">
              {friend.topFriend && (
                <p className="top-friend-flag">⭐ Top Friend</p>
              )}
              <p className="page-paragraph">{friend.name}</p>
              <p className="page-micro">
                {friend.jobTitle} @ {friend.companyName}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </section>
)};