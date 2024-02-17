import React, { useState } from "react"
import './Comments.css'
import Reply from "./Reply"

function Comments(props) {
    const [name, setName] = useState("")
    const [comment, setComment] = useState("")
    const [replyName, setReplyName] = useState("")
    const [replyComment, setReplyComment] = useState("")

    let storedComments = localStorage.getItem('commentsArr');
    storedComments = storedComments ? JSON.parse(storedComments) : [];
    const [commentsArr, setCommentsArr] = useState(storedComments)
    const [replyToggle, setReplyToggle] = useState(false)
    const [replyCommentId, setReplyCommentId] = useState("")
    const [editFlag, setEditFlag] = useState(false)


    const generateCommentId = (length) => {
        const characters = '0123456789';
        let id = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            id += characters.charAt(randomIndex);
        }
        return id;
    }

    const getFormattedDate = (date) => {
        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        date = new Date(date);


        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        const dayWithSuffix = addOrdinalSuffix(day);

        const monthName = monthNames[month];

        return `${dayWithSuffix} ${monthName} ${year}`;
    }

    function addOrdinalSuffix(day) {
        if (day >= 11 && day <= 13) {
            return `${day}th`;
        }
        switch (day % 10) {
            case 1: return `${day}st`;
            case 2: return `${day}nd`;
            case 3: return `${day}rd`;
            default: return `${day}th`;
        }
    }


    const getCurrentDate = () => {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');

        const dateString = `${year}-${month}-${day}`;
        let date = getFormattedDate(dateString);

        return date
    }

    function findItemByCommentId(id, items) {
        for (const item of items) {
            if (item.commentId === id) {
                return item;
            }
            const foundInReplies = findItemByCommentId(id, item.replies);
            if (foundInReplies) {
                return foundInReplies;
            }
        }
        return null;
    }



    const handlePost = (e) => {
        e.preventDefault();
        let commentId = generateCommentId(5)
        let commentDate = getCurrentDate()
        const newComment = { commentDate, commentId, name, comment, replies: [] };
        setCommentsArr([...commentsArr, newComment]);

        localStorage.setItem('commentsArr', JSON.stringify([...commentsArr, newComment]));

        setName('');
        setComment('');
    };

    const handleReplyPost = (e, parentId) => {
        e.preventDefault();
        let commentId = generateCommentId(5)
        let commentDate = getCurrentDate()

        const newComment = { commentDate, commentId, "name": replyName, "comment": replyComment, replies: [] };
        const parentItem = findItemByCommentId(parentId, commentsArr);
        if (parentItem && !editFlag) {
            parentItem.replies.push(newComment);
            localStorage.setItem('commentsArr', JSON.stringify(commentsArr));
        } else if (editFlag) {
            parentItem.name = replyName
            parentItem.comment = replyComment
            localStorage.setItem('commentsArr', JSON.stringify(commentsArr));

        } {
            console.error('Parent item not found!');
        }
        setReplyComment('')
        setReplyName('')
        setReplyToggle(false)

    }

    const handleReply = (parentId) => {
        setReplyToggle(true)
        setReplyCommentId(parentId);
        return
    }

    const handleEdit = (parentId, name, comment) => {
        setEditFlag(true)
        setReplyName(name)
        setReplyComment(comment)
        setReplyToggle(true)
        setReplyCommentId(parentId);

    }


    const deleteCommentOrReply = (id) => {
        const index = findItemIndexById(id);
        if (index !== -1) {
            // Create a new array with the item removed
            const updatedCommentsArr = [...commentsArr.slice(0, index), ...commentsArr.slice(index + 1)];
            localStorage.setItem('commentsArr', JSON.stringify(updatedCommentsArr));
            // Update the state with the new array
            setCommentsArr(updatedCommentsArr);
            return false;
        } else {
            console.error('Item not found!');
        }
    }

    const findItemIndexById = (id, items = commentsArr) => {
        for (let i = 0; i < items.length; i++) {
            if (items[i].commentId === id) {
                return i;
            }
            const foundInReplies = findItemIndexById(id, items[i].replies);
            if (foundInReplies !== -1) {
                return foundInReplies;
            }
        }
        return -1;
    }



    return (
        <>
            <div id="comments-section">
                <h3>Comment</h3>
                <form id="comment-form" onSubmit={handlePost}>
                    <label htmlFor="name">Name:</label><br />
                    <input type="text" id="name" name="name" placeholder='name' value={name} onChange={(e) => setName(e.target.value)} required /><br />
                    <label htmlFor="comment">Comment:</label><br />
                    <textarea id="comment" name="comment" placeholder="comment" value={comment} onChange={(e) => setComment(e.target.value)} required></textarea><br />
                    <button type="submit">Post</button>
                </form>


            </div>
            <div id="reply">
                {commentsArr.map((c, index) => (
                    <>
                        <div className="comment_date">
                            <span>{c.commentDate}</span>
                        </div>
                        <div key={index} className="comment">
                            <strong>{c.name}</strong>
                            <div className="container">

                                <span className="delete-icon" onClick={() => deleteCommentOrReply(c.commentId)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                    <circle cx="12" cy="12" r="11" fill="black" />
                                    <path d="M12 6c-.55 0-1 .45-1 1v7c0 .55.45 1 1 1s1-.45 1-1V7c0-.55-.45-1-1-1zm-2 10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1s1 .45 1 1v9zm4 0c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1s1 .45 1 1v9zm2-12H8c-.55 0-1 .45-1 1s.45 1 1 1h8c.55 0 1-.45 1-1s-.45-1-1-1z" fill="white" />
                                </svg></span>
                            </div>
                            <p>{c.comment}</p>
                            <div className="reply_edit">
                                <span onClick={() => handleReply(c.commentId)}>Reply</span>
                                <span onClick={() => handleEdit(c.commentId, c.name, c.comment)}>Edit</span>
                            </div>

                        </div>
                        {
                            (replyToggle && c.commentId == replyCommentId) && <div id="comments-section" style={{ marginLeft: '20px' }}><form id="comment-form" onSubmit={(e) => handleReplyPost(e, c.commentId)}>
                                <label htmlFor="name">Name:</label><br />
                                <input type="text" id="name" placeholder='name' name="reply_name" value={replyName} onChange={(e) => setReplyName(e.target.value)} required /><br />
                                <label htmlFor="comment">Comment:</label><br />
                                <textarea id="comment" placeholder="comment" name="reply_comment" value={replyComment} onChange={(e) => setReplyComment(e.target.value)} required></textarea><br />
                                <button type="submit">Post</button>
                            </form></div>

                        }
                        <div style={{ marginLeft: '20px' }}>
                            {c.replies.map((reply) => (
                                <Reply key={reply.commentId} commentId={reply.commentId} replies={reply.replies} name={reply.name} comment={reply.comment} findItemByCommentId={findItemByCommentId} commentsArr={commentsArr} deleteCommentOrReply={deleteCommentOrReply} commentDate={reply.commentDate} />
                            ))}
                        </div>
                    </>
                ))}

            </div>
        </>
    )

}



export default Comments