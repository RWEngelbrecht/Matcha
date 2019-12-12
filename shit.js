Likes.find({likeBy: currUser._id}).then((liked) => {
    liked.forEach(user => {
        likedUserIDs.push(user.likedUser); // profiles that current user has liked
    });
    User.find({_id: {$in: likedUserIDs}, username: {$nin: currUser.blocked}},(err, likedUsrs) => {
        Likes.find({likedUser: currUser._id}, (err, currLiked) => {
            // people that have liked the current user
            currLiked.forEach(likedBy => {
                currUserLikedBy.push(likedBy.likeBy.toString())
            });
            User.find({_id: {$in: currUserLikedBy}}, (err, currLikedBy) => {
                console.log('current user is liked By: ',currLikedBy);
                var matched = filters.getMatched(currLiked, likedUsrs); // filtered out people who user hasn't liked
                                                //filter matched users that also liked current user from likedUsers
                var notMatched = filters.filterMatches(likedUsrs, matched);

                res.render(path.resolve('views/matches'), {likedMatches: notMatched, matched: matched, user: currUser, likedBy: currLikedBy});
            })
        });
    })
})