const express = require('express');
const router = express.Router();
const UserProfile = require('../models/userProfileModel');
const FriendShip = require('../models/friendShipModel');
const mongoose = require('mongoose');

// show ra danh sách bạn bè
//- Lấy danh sách bạn bè mà người dùng đã đồng ý kết bạn
router.get('/v1/friends/accepted/:userId', async (req, res) => {
    const userId = req.params.userId; // Lấy ID người dùng từ tham số URL

    try {
        const friendships = await FriendShip.find({
            profile_accept_id: userId,
            'status.state': 'ACCEPTED',
        }).populate({
            path: 'profile_require_id profile_accept_id',
            select: 'first_name last_name email',
        });
        // Trả về danh sách bạn bè mà người dùng đã đồng ý
        res.status(200).json({ data: friendships, message: 'Friends (accepted) retrieved successfully', status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});
//- Lấy danh sách bạn bè mà người dùng đã gửi kết bạn
router.get('/v1/friends/pending/:userId', async (req, res) => {
    const userId = req.params.userId; // Lấy ID người dùng từ tham số URL

    try {
        const friendships = await FriendShip.find({
            profile_accept_id: userId,
            'status.state': 'PENDING',
        }).populate({
            path: 'profile_require_id profile_accept_id',
            select: 'first_name last_name email',
        });

        // Trả về danh sách bạn bè mà người dùng đã đồng ý
        res.status(200).json({ data: friendships, message: 'Friends (pending) retrieved successfully', status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});
//- lấy danh sách người bị block
router.get('/v1/friends/block/:userId', async (req, res) => {
    const userId = req.params.userId; // Lấy ID người dùng từ tham số URL

    try {
        const blockUser = await FriendShip.find({
            profile_accept_id: userId,
            'status.state': 'BLOCK',
        }).populate({
            path: 'profile_require_id profile_accept_id',
            select: 'first_name last_name email',
        });

        // Trả về danh sách bạn bè mà người dùng đã đồng ý
        res.status(200).json({ data: blockUser, message: 'Friends (Block) retrieved successfully', status: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// POST - Create a new friendship request
router.post('/v1/send-request', async (req, res) => {
    const { profile_accept_id, profile_require_id } = req.body; // ID của người nhận yêu cầu
    // const profile_require_id = req.params.id; // Giả sử bạn lấy ID người dùng đang đăng nhập từ middleware xác thực

    try {
        // Validate if the IDs are provided
        if (!profile_accept_id || !profile_require_id) {
            return res.status(400).json({
                data: {},
                message: 'Both profile_accept_id and profile_require_id are required',
                status: 400,
            });
        }
        // Kiểm tra xem người dùng có đang gửi yêu cầu tới chính họ không
        if (profile_require_id === profile_accept_id) {
            return res
                .status(400)
                .json({ data: {}, message: 'You cannot send a friend request to yourself', status: 400 });
        }
        // Check if a friendship request already exists
        const existingFriendship = await FriendShip.findOne({
            profile_accept_id,
            profile_require_id,
            isActive: true,
        });

        if (existingFriendship) {
            return res.status(400).json({
                data: {},
                message: 'A friend request has already been sent',
                status: 400,
            });
        }
        // Tạo một yêu cầu kết bạn mới
        const newFriendship = new FriendShip({
            profile_require_id,
            profile_accept_id,
            status: {
                state: 'PENDING',
                pendingDate: Date.now(),
                acceptedDate: null, // Không cần thiết lập giá trị cho trường này
                rejectedDate: null, // Không cần thiết lập giá trị cho trường này
                unFriendDate: null,
                blockDate: null,
                unBlockDate: null,
            },
            isActive: true, // Đánh dấu yêu cầu là hoạt động
        });
        // Lưu yêu cầu kết bạn vào cơ sở dữ liệu
        const savedFriendship = await newFriendship.save();

        // Trả về thông tin yêu cầu đã gửi thành công
        res.status(201).json({ data: savedFriendship, message: 'Friend request sent successfully', status: 201 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// PUT - Chấp nhận yêu cầu kết bạn
router.put('/v1/accept-request/:accept_id/:require_id', async (req, res) => {
    const profile_accept_id = req.params.accept_id; // Lấy ID của người chấp nhận từ URL
    const profile_require_id = req.params.require_id; // Lấy ID của người yêu cầu từ URL
    try {
        // Kiểm tra xem ID có hợp lệ không
        if (!profile_accept_id || !profile_require_id) {
            return res.status(400).json({ data: {}, message: 'Invalid profile IDs', status: 400 });
        }
        // Cập nhật trạng thái yêu cầu kết bạn
        const updatedFriendship = await FriendShip.updateOne(
            {
                profile_accept_id,
                profile_require_id,
                isActive: true, // Đảm bảo chỉ cập nhật các yêu cầu đang hoạt động
                'status.state': 'PENDING', // Đảm bảo chỉ cập nhật các yêu cầu đang trong trạng thái PENDING
            },
            {
                $set: {
                    'status.state': 'ACCEPTED',
                    'status.acceptedDate': Date.now(), // Gán giá trị cho acceptedDate
                    'status.pendingDate': null, // Ẩn đi pendingDate
                    'status.rejectedDate': null, // Ẩn đi rejectedDate
                    'status.unFriendDate': null,
                    'status.blockDate': null,
                    'status.unBlockDate': null,
                },
            },
            { new: true } // Tham số này không có tác dụng với updateOne
        );

        // Kiểm tra xem có tài liệu nào được cập nhật không
        if (!updatedFriendship) {
            return res
                .status(404)
                .json({ data: {}, message: 'Friendship request not found or already accepted', status: 404 });
        }
        // Lấy thông tin của người yêu cầu kết bạn (B)
        const userB = await UserProfile.findById(profile_require_id);
        if (!userB) {
            return res.status(404).json({ data: {}, message: 'User B not found', status: 404 });
        }
        // Lấy thông tin của người chấp nhận kết bạn (A)
        const userA = await UserProfile.findById(profile_accept_id);
        if (!userA) {
            return res.status(404).json({ data: {}, message: 'Find Id Not fount', status: 404 });
        }
        // Thêm profile_require_id (người B) vào friend_array của profile_accept_id (người A)
        await UserProfile.findByIdAndUpdate(
            profile_accept_id,
            {
                $addToSet: {
                    friend_array: {
                        friend_id: new mongoose.Types.ObjectId(profile_require_id), // Chuyển thành ObjectId
                        friend_name: `${userB.first_name} ${userB.last_name}`, // Thêm tên của B
                    },
                },
            },
            { new: true, upsert: true }
        );

        // Thêm profile_accept_id (người A) vào friend_array của profile_require_id (người B)
        await UserProfile.findByIdAndUpdate(
            profile_require_id,
            {
                $addToSet: {
                    friend_array: {
                        friend_id: new mongoose.Types.ObjectId(profile_accept_id), // Chuyển thành ObjectId
                        friend_name: `${userA.first_name} ${userA.last_name}`, // Thêm tên của A
                    },
                },
            },
            { new: true }
        );
        res.status(200).json({
            data: { profile_accept_id, profile_require_id },
            message: 'Friendship request accepted successfully',
            status: 200,
        });
    } catch (error) {
        console.error(error); // Log lỗi để dễ dàng theo dõi
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

// put / -từ chối kết bạn
router.put('/v1/rejected-request/:accept_id/:require_id', async (req, res) => {
    const profile_accept_id = req.params.accept_id; // Lấy ID của người chấp nhận từ URL
    const profile_require_id = req.params.require_id; // Lấy ID của người yêu cầu từ URL

    // Kiểm tra xem ID có hợp lệ không
    if (!profile_accept_id || !profile_require_id) {
        return res.status(400).json({ data: {}, message: 'Invalid profile IDs', status: 400 });
    }

    try {
        // Cập nhật trạng thái yêu cầu kết bạn
        const updatedFriendship = await FriendShip.updateOne(
            {
                profile_accept_id,
                profile_require_id,
                isActive: true, // Đảm bảo chỉ cập nhật các yêu cầu đang hoạt động
                'status.state': 'PENDING', // Đảm bảo chỉ cập nhật các yêu cầu đang trong trạng thái PENDING
            },
            {
                $set: {
                    'status.state': 'REJECTED',
                    'status.rejectedDate': Date.now(), // Gán giá trị cho acceptedDate
                    'status.pendingDate': null, // Ẩn đi pendingDate
                    'status.acceptedDate': null, // Ẩn đi rejectedDate
                    'status.unFriendDate': null,
                    'status.blockDate': null,
                    'status.unBlockDate': null,
                    isActive: false, // Đánh dấu yêu cầu là không còn hoạt động
                },
            },
            { new: true } // Tham số này không có tác dụng với updateOne
        );

        // Kiểm tra xem có tài liệu nào được cập nhật không
        if (updatedFriendship.modifiedCount === 0) {
            return res
                .status(404)
                .json({ data: {}, message: 'Friendship request not found or already accepted', status: 404 });
        }

        res.status(200).json({
            data: { profile_accept_id, profile_require_id },
            message: 'Friendship request rejected successfully',
            status: 200,
        });
    } catch (error) {
        console.error(error); // Log lỗi để dễ dàng theo dõi
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});
// show ra danh sách bạn bè

//Hủy kết bạn 
router.put('/v1/unfriend/:accept_id/:require_id', async (req, res) => {
    const profile_accept_id = req.params.accept_id; // Lấy ID của người chấp nhận từ URL
    const profile_require_id = req.params.require_id; // Lấy ID của người yêu cầu từ URL
    // Kiểm tra xem ID có hợp lệ không
    if (!profile_accept_id || !profile_require_id) {
        return res.status(400).json({ data: {}, message: 'Invalid profile IDs', status: 400 });
    }

    try {
        const UnFriendship = await FriendShip.updateOne(
            {
                profile_accept_id,
                profile_require_id,
                isActive: true, // Đảm bảo chỉ cập nhật các yêu cầu đang hoạt động
                'status.state': 'ACCEPTED', // Đảm bảo chỉ cập nhật các yêu cầu đang trong trạng thái PENDING
            },
            {
                $set: {
                    'status.state': 'UNFRIEND',
                    'status.unFriendDate': Date.now(),
                    'status.pendingDate': null, // Ẩn đi pendingDate
                    'status.acceptedDate': null, // Ẩn đi rejectedDate
                    'status.rejectedDate': null, // Gán giá trị cho acceptedDate
                    'status.blockDate': null,
                    'status.unBlockDate': null,
                    isActive: false, // Đánh dấu yêu cầu là không còn hoạt động
                },
            },
            { new: true } // Tham số này không có tác dụng với updateOne
        );

        // Kiểm tra xem có tài liệu nào được cập nhật không
        if (UnFriendship.modifiedCount === 0) {
            return res
                .status(404)
                .json({ data: {}, message: 'Friendship request not found or already unfriend', status: 404 });
        }

         // Hủy một người trong mảng friend_array
         await UserProfile.findByIdAndUpdate(
            profile_accept_id,
            {
                $pull: {
                    friend_array: {
                        friend_id: new mongoose.Types.ObjectId(profile_require_id),
                    },
                },
            },
            { new: true }
        );

        await UserProfile.findByIdAndUpdate(
            profile_require_id,
            {
                $pull: {
                    friend_array: {
                        friend_id:new mongoose.Types.ObjectId(profile_accept_id),
                    },
                },
            },
            { new: true }
        );

        res.status(200).json({
            data: { profile_accept_id, profile_require_id },
            message: 'Friendship request unfriend successfully',
            status: 200,
        });
    } catch (error) {
        console.error(error); // Log lỗi để dễ dàng theo dõi
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

//Block User
router.post('/v1/block', async (req, res) => {
    const { profile_accept_id, profile_require_id } = req.body; // ID của người nhận yêu cầu
    // const profile_require_id = req.params.id; // Giả sử bạn lấy ID người dùng đang đăng nhập từ middleware xác thực

    try {
        // Validate if the IDs are provided
        if (!profile_accept_id || !profile_require_id) {
            return res.status(400).json({
                data: {},
                message: 'Both profile_accept_id and profile_require_id are required',
                status: 400,
            });
        }
        // Kiểm tra xem người dùng có đang gửi yêu cầu tới chính họ không
        if (profile_require_id === profile_accept_id) {
            return res
                .status(400)
                .json({ data: {}, message: 'You cannot send a friend request to yourself', status: 400 });
        }
        // Check if a friendship request already exists
        const existingFriendship = await FriendShip.findOne({
            profile_accept_id,
            profile_require_id,
            isActive: true,
        });

        if (existingFriendship) {
            return res.status(400).json({
                data: {},
                message: 'user block has already been sent',
                status: 400,
            });
        }
        // Tạo một yêu cầu kết bạn mới
        const blockUSer = new FriendShip({
            profile_require_id,
            profile_accept_id,
            status: {
                state: 'BLOCK',
                blockDate: Date.now(),
                pendingDate: null,
                acceptedDate: null, // Không cần thiết lập giá trị cho trường này
                rejectedDate: null, // Không cần thiết lập giá trị cho trường này
                unFriendDate: null,
                unBlockDate: null,
            },
            isActive: true, // Đánh dấu yêu cầu là hoạt động
        });
        // Lưu yêu cầu kết bạn vào cơ sở dữ liệu
        const saveBlockUser = await blockUSer.save();
        // Lấy thông tin của người yêu cầu kết bạn (B)
        const userB = await UserProfile.findById(profile_require_id);
        if (!userB) {
            return res.status(404).json({ data: {}, message: 'User B not found', status: 404 });
        }
        // Lấy thông tin của người chấp nhận kết bạn (A)
        const userA = await UserProfile.findById(profile_accept_id);
        if (!userA) {
            return res.status(404).json({ data: {}, message: 'Find Id Not fount', status: 404 });
        }
        // Thêm profile_require_id (người B) vào friend_array của profile_accept_id (người A)
        await UserProfile.findByIdAndUpdate(
            profile_accept_id,
            {
                $addToSet: {
                    blockUser_array: {
                        block_id: new mongoose.Types.ObjectId(profile_require_id), // Chuyển thành ObjectId
                        block_name: `${userB.first_name} ${userB.last_name}`, // Thêm tên của B
                    },
                },
            },
            { new: true, upsert: true }
        );

        // Thêm profile_accept_id (người A) vào friend_array của profile_require_id (người B)
        await UserProfile.findByIdAndUpdate(
            profile_require_id,
            {
                $addToSet: {
                    blockUser_array: {
                        block_id: new mongoose.Types.ObjectId(profile_accept_id), // Chuyển thành ObjectId
                        block_name: `${userA.first_name} ${userA.last_name}`, // Thêm tên của A
                    },
                },
            },
            { new: true }
        );
        // Trả về thông tin yêu cầu đã gửi thành công
        res.status(201).json({ data: saveBlockUser, message: 'Block User successfully', status: 201 });
    } catch (error) {
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

//UNBLOCK user
router.put('/v1/unblock/:accept_id/:require_id', async (req, res) => {
    const profile_accept_id = req.params.accept_id; // Lấy ID của người chấp nhận từ URL
    const profile_require_id = req.params.require_id; // Lấy ID của người yêu cầu từ URL
    // Kiểm tra xem ID có hợp lệ không
    if (!profile_accept_id || !profile_require_id) {
        return res.status(400).json({ data: {}, message: 'Invalid profile IDs', status: 400 });
    }

    try {
        const UnBlock = await FriendShip.updateOne(
            {
                profile_accept_id,
                profile_require_id,
                isActive: true, // Đảm bảo chỉ cập nhật các yêu cầu đang hoạt động
                'status.state': 'BLOCK', // Đảm bảo chỉ cập nhật các yêu cầu đang trong trạng thái 
            },
            {
                $set: {
                    'status.state': 'UNBLOCK',
                    'status.unBlockDate': Date.now(),
                    'status.pendingDate': null, // Ẩn đi pendingDate
                    'status.acceptedDate': null, // Ẩn đi rejectedDate
                    'status.rejectedDate': null, // Gán giá trị cho acceptedDate
                    'status.unFriendDate': null,
                    'status.blockDate': null,
                    isActive: false, // Đánh dấu yêu cầu là không còn hoạt động
                },
            },
            { new: true } // Tham số này không có tác dụng với updateOne
        );

        // Kiểm tra xem có tài liệu nào được cập nhật không
        if (UnBlock.modifiedCount === 0) {
            return res
                .status(404)
                .json({ data: {}, message: 'Friendship request not found or already unfriend', status: 404 });
        }

         // Hủy một người trong mảng friend_array
         await UserProfile.findByIdAndUpdate(
            profile_accept_id,
            {
                $pull: {
                    blockUser_array: {
                        block_id: new mongoose.Types.ObjectId(profile_require_id),
                    },
                },
            },
            { new: true }
        );

        await UserProfile.findByIdAndUpdate(
            profile_require_id,
            {
                $pull: {
                    blockUser_array: {
                        block_id:new mongoose.Types.ObjectId(profile_accept_id),
                    },
                },
            },
            { new: true }
        );

        res.status(200).json({
            data: { profile_accept_id, profile_require_id },
            message: 'Unblock user successfully',
            status: 200,
        });
    } catch (error) {
        console.error(error); // Log lỗi để dễ dàng theo dõi
        res.status(500).json({ data: {}, message: error.message, status: 500 });
    }
});

module.exports = router;
// POST - create a new follow 
// router.post('/v1/follow', async (req, res) => {
//     const { profile_accept_id, profile_require_id } = req.body; // ID của người nhận yêu cầu
//     try {
//         // Validate if the IDs are provided
//         if (!profile_accept_id || !profile_require_id) {
//             return res.status(400).json({
//                 data: {},
//                 message: 'Both profile_accept_id and profile_require_id are required',
//                 status: 400,
//             });
//         }
//         // Kiểm tra xem người dùng có đang gửi yêu cầu tới chính họ không
//         if (profile_require_id === profile_accept_id) {
//             return res
//                 .status(400)
//                 .json({ data: {}, message: 'You cannot send a friend request to yourself', status: 400 });
//         }
//         // Check if a friendship request already exists
//         const existingFollow = await FriendShip.findOne({
//             profile_accept_id,
//             profile_require_id,
//             isFollowActive: true,
//         });

//         if (existingFollow) {
//             return res.status(400).json({
//                 data: {},
//                 message: 'A follow request has already been sent',
//                 status: 400,
//             });
//         }
//         // Tạo một yêu flo kết bạn mới
//         const newFollow = new FriendShip({
//             profile_require_id,
//             profile_accept_id,
//             status : {}
//             followStatus: {
//                 state: 'FOLLOW',
//                 followDate: Date.now(),
//                 unFollowDate: null,
//             },
//             isFollowActive: true, // Đánh dấu yêu cầu là hoạt động
//         });
//         // Lưu yêu cầu kết bạn vào cơ sở dữ liệu
//         const savedFollow = await newFollow.save();
//         // Lấy thông tin của người yêu cầu kết bạn (B)
//         const userB = await UserProfile.findById(profile_require_id);
//         if (!userB) {
//             return res.status(404).json({ data: {}, message: 'User B not found', status: 404 });
//         }
//         // Lấy thông tin của người chấp nhận kết bạn (A)
//         const userA = await UserProfile.findById(profile_accept_id);
//         if (!userA) {
//             return res.status(404).json({ data: {}, message: 'Find Id Not fount', status: 404 });
//         }
//         await UserProfile.findByIdAndUpdate(
//             profile_accept_id,
//             {
//                 $addToSet: {
//                     follow_array: {
//                         follow_id: new mongoose.Types.ObjectId(profile_require_id), // Chuyển thành ObjectId
//                         follow_name: `${userB.first_name} ${userB.last_name}`, // Thêm tên của B
//                     },
//                 },
//             },
//             { new: true, upsert: true }
//         );

//         await UserProfile.findByIdAndUpdate(
//             profile_require_id,
//             {
//                 $addToSet: {
//                     follow_array: {
//                         follow_id: new mongoose.Types.ObjectId(profile_accept_id), // Chuyển thành ObjectId
//                         follow_name: `${userA.first_name} ${userA.last_name}`, // Thêm tên của A
//                     },
//                 },
//             },
//             { new: true }
//         );
//         // Trả về thông tin yêu cầu đã gửi thành công
//         res.status(201).json({ data: savedFollow, message: 'follow request sent successfully', status: 201 });
//     } catch (error) {
//         res.status(500).json({ data: {}, message: error.message, status: 500 });
//     }
// });

// // Hủy Follow
// router.put('/v1/unfollow/:accept_id/:require_id', async (req, res) => {
//     const profile_accept_id = req.params.accept_id; // Lấy ID của người chấp nhận từ URL
//     const profile_require_id = req.params.require_id; // Lấy ID của người yêu cầu từ URL
//     // Kiểm tra xem ID có hợp lệ không
//     if (!profile_accept_id || !profile_require_id) {
//         return res.status(400).json({ data: {}, message: 'Invalid profile IDs', status: 400 });
//     }

//     try {
//         const unfollower = await FriendShip.updateOne(
//             {
//                 profile_accept_id,
//                 profile_require_id,
//                 isFollowActive: true, // Đảm bảo chỉ cập nhật các yêu cầu đang hoạt động
//                 'followStatus.state': 'FOLLOW', // Đảm bảo chỉ cập nhật các yêu cầu đang trong trạng thái PENDING
//             },
//             {
//                 $set: {
//                     'followStatus.state': 'UNFOLLOW',
//                     'followStatus.unFollowDate': Date.now(),
//                     'followStatus.followDate': null, 
//                     isFollowActive: false, // Đánh dấu yêu cầu là không còn hoạt động
//                 },
//             },
//             { new: true } // Tham số này không có tác dụng với updateOne
//         );

//         // Kiểm tra xem có tài liệu nào được cập nhật không
//         if (unfollower.modifiedCount === 0) {
//             return res
//                 .status(404)
//                 .json({ data: {}, message: 'Friendship request not found or already unfriend', status: 404 });
//         }

//          // Hủy một người trong mảng friend_array
//          await UserProfile.findByIdAndUpdate(
//             profile_accept_id,
//             {
//                 $pull: {
//                     follow_array: {
//                         follow_id: new mongoose.Types.ObjectId(profile_require_id),
//                     },
//                 },
//             },
//             { new: true }
//         );

//         await UserProfile.findByIdAndUpdate(
//             profile_require_id,
//             {
//                 $pull: {
//                     follow_array: {
//                         follow_id:new mongoose.Types.ObjectId(profile_accept_id),
//                     },
//                 },
//             },
//             { new: true }
//         );

//         res.status(200).json({
//             data: { profile_accept_id, profile_require_id },
//             message: 'unfollow request unfriend successfully',
//             status: 200,
//         });
//     } catch (error) {
//         console.error(error); // Log lỗi để dễ dàng theo dõi
//         res.status(500).json({ data: {}, message: error.message, status: 500 });
//     }
// });



