const User = require('../models/User');


exports.follow = async (request, response) => {
    try {

    const { targetUserId } = request.params;
    const currentUserId = request.user._id
    // Find user in db by id passed in params
    const userToFollow = await User.findById(targetUserId);

    if (!userToFollow) {
        return response.status(404).json({ message: 'User not found'})
    } 
    // If user already follows userToFollow
    if (userToFollow.followers.includes(currentUserId)) {
        return response.status(400).json({ message: 'Account already followed'})
    }

    // Push follower id to following followers array
    userToFollow.followers.push(currentUserId);
    await userToFollow.save();
    
    // Push following id to followers following array
    const currentUser = await User.findById(currentUserId);
    currentUser.following.push(targetUserId);
    await currentUser.save();

    return response.status(200).json({ message: 'Follow successful' })

} catch (error) {
    console.error('Error following account:', error);
    return response.status(500).json({ message: 'Internal server error' })
}
}

exports.unfollow = async (req, res) => {
    try {
      const { targetUserId } = req.params; // The user to unfollow
      const currentUserId = req.user._id; // The current user making the request
      const userToUnfollow = await User.findById(targetUserId); // Find the target user (the user to be unfollowed)

      if (!userToUnfollow) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the current user is following the user
      if (!userToUnfollow.followers.includes(currentUserId)) {
        return res.status(400).json({ message: 'You are not following this user' });
      }
  
      // Remove the current user from the target user's followers list
      userToUnfollow.followers = userToUnfollow.followers.filter(follower => follower.toString() !== currentUserId.toString());
      await userToUnfollow.save();
  
      // Remove the target user from the current user's following list
      const currentUser = await User.findById(currentUserId);
      currentUser.following = currentUser.following.filter(following => following.toString() !== targetUserId.toString());
      await currentUser.save();
  
      return res.status(200).json({ message: 'Unfollow successful' });
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };

  exports.getFollowData = async (request, response) => {
    try {
      const { targetUserId }= request.params;
      const currentUserId = request.user._id;
      const userToFollow = await User.findById(targetUserId);

      if (!userToFollow || !currentUser) {
        return response.status(404).json({ message: 'User not found' });
      }

      // Is current user id in target users followers array
      const isFollowing = userToFollow.followers.includes(currentUserId);
      const followersCount = userToFollow.followers.length;
      const followingCount = userToFollow.following.length;

      // Debug log
      console.log('Is following:', isFollowing);
      console.log('Followers count:', followersCount);
      console.log('Following count:', followingCount);

      return response.status(200).json({
        isFollowing,
        followersCount,
        followingCount
      });
      
    } catch (error) {
      console.error('Error fetching follow data', error);
      return response.status(500).json({ message: 'Internal server error'});
    }
  };

