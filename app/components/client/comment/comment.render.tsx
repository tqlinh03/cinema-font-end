"use client";
import { useAppSelector } from "@/app/redux/hook";
import { Comment } from "@ant-design/compatible";
import { Avatar, Divider, Tooltip } from "antd";
import moment from "moment";
import { Editor } from "./editor";
import React, { createElement, useContext, useState } from "react";
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from "@ant-design/icons";
import { WebsocketContext } from "@/app/contexts/WebsocketContext";
import { callCreateReplyComment, callFetchComment, callFetchCommentByMovieId } from "@/app/config/api";
import { ICommentProps } from "@/app/types/backend";

interface IProps {
  comment: ICommentProps,
  movieId: number
}
export const RenderComment = ({ 
  comment,
  movieId
 }: IProps) => {
  const [likes, setLikes] = useState(0);
  const [likesState, setLikesStaet] = useState<boolean>(true);
  const [dislikes, setDislikes] = useState(0);
  const [action, setAction] = useState<string | null>(null);
  const [value, setValue] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [showRelyCommentId, setShowReplyCommentId] = useState<number[]>([]);
  const user = useAppSelector((state) => state.account.user);
  const socket = useContext(WebsocketContext)


  const like = async (commentId?: number) => {
    setLikesStaet((prevState) => !prevState);
    setDislikes(0);
    setAction("liked");

    const like = { user: +user._id, comment: commentId };
    // const res = await callCreateLikeComment(like)
    // console.log(res)
  };

  const dislike = () => {
    setLikes(0);
    setDislikes(1);
    setAction("disliked");
  };


  const actions = (commentId: number) => [
    <Tooltip key="comment-basic-like" title="Like">
      <span onClick={() => like(commentId)}>
        {createElement(likesState === false ? LikeFilled : LikeOutlined)}
        <span className="comment-action">{likes}</span>
      </span>
    </Tooltip>,
    <Tooltip key="comment-basic-dislike" title="Dislike">
      <span onClick={dislike}>
        {React.createElement(
          action === "disliked" ? DislikeFilled : DislikeOutlined
        )}
        <span className="comment-action">{dislikes}</span>
      </span>
    </Tooltip>,
    <span key={commentId} onClick={() => toggleCommentVisibility(commentId)}>
      Reply to
    </span>,
  ];

  const toggleCommentVisibility = (commentId: number) => {
    setShowReplyCommentId([commentId]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (commentId: number) => {
    if (!value) return;
    const replyComment = {
      content: value,
      user: +user._id,
    };
    setSubmitting(true)
    const res = await callCreateReplyComment(commentId, replyComment)
    console.log(res)
    setTimeout(async () => {
      setValue('');
      if(res.data) {
        const res = await callFetchCommentByMovieId(movieId);
        socket.emit('newMessage', res.data);
      }
      setSubmitting(false)
      setShowReplyCommentId([])
    }, 500);
  };
 
  return (
    <>
    <Divider style={{ background: 'rgb(231 225 225)', margin: 0 }}/>
      <Comment
        key={comment._id}
        actions={[actions(comment._id)]}
        author={<a>{comment.user.name}</a>}
        avatar={
          <Avatar>{comment.user.name.substring(0, 1).toUpperCase()}</Avatar>
        }
        content={comment.content}
        datetime={moment(comment.createdAt).fromNow()}
      >
        {showRelyCommentId.includes(comment._id) === true && (
          <Comment
            avatar={<Avatar>{user?.name.substring(0, 1).toUpperCase()}</Avatar>}
            content={
              <Editor
                onChange={handleChange}
                onSubmit={() => handleSubmit(comment._id)}
                submitting={submitting}
                value={value}
              />
            }
          />
        )}
        {comment.replies && Array.isArray(comment.replies) && 
          comment.replies.length > 0 && (
            <>
            {comment.replies.map((rely) => 
            
              <RenderComment 
                comment={rely} 
                movieId={movieId}
              />)}
            </>
          )
        
        }
      </Comment>
    </>
  );
};
