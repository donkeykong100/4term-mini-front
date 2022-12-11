import axios from "../api/config";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import styled from "@emotion/styled";
import { ReactComponent as Smile } from "../assets/smile.svg";
import dayjs from "dayjs";
import { getUserNickname, getUserNo } from "../utils/getToken";
import catchGlobalError from "../utils/catchGlobalError";

const PostPage = () => {
  const nickname = getUserNickname();
  const userNo = getUserNo();
  const { postNo } = useParams();
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [writer, setWriter] = useState("");
  const [value, setValue] = useState("");
  const [myInfo, setMyInfo] = useState({});
  const scrollRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        const { data: postData } = await axios.get(`post/${postNo}`);
        const { data: postComments } = await axios.get(`comment/${postNo}`);
        const { data: writerInfo } = await axios.get(
          `user/search/${postData?.nickname}`
        );
        const { data: myProfile } = await axios.get(`user/search/${nickname}`);
        setPost({
          postData,
        });
        setComments([...postComments]);
        setWriter(writerInfo.user[0]);
        setMyInfo(myProfile.user[0]);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [postNo]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post(
        `comment/`,
        { content: value },
        {
          params: {
            userNo,
            postNo,
          },
        }
      );

      setComments([
        ...comments,
        {
          userNo,
          commentNo: data.commentNo,
          date: Date.now(),
          content: value,
          profileImage: myInfo.profile_image,
          nickname: myInfo.nickname,
        },
      ]);
      setValue("");
      alert(data.msg);
      scrollRef?.current?.scrollIntoView({});
    } catch (error) {
      catchGlobalError(error) || alert(error.message);
    }
  };

  const delComment = async (commentNo) => {
    try {
      const { data } = await axios.delete(`comment`, {
        params: {
          userNo,
          commentNo,
        },
      });
      if (data.success) {
        setComments(
          [...comments].filter((comment) => !(comment.commentNo === commentNo))
        );
        alert(data.msg);
      } else {
        alert(data.msg);
      }

      console.log(data);
    } catch (error) {
      catchGlobalError(error) || alert(error.message);
    }
  };

  console.log(comments);

  return (
    <>
      {post && writer && (
        <PostWrapper>
          <PostContainer>
            <ImageContainer>
              <PostImage src={post.postData?.images[0]} />
            </ImageContainer>
            <CommentContainer>
              <div>
                <WriteInfo>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <WriterProfile
                      src={
                        writer?.profile_image
                          ? writer?.profile_image
                          : "/img/defaultProfile.jpg"
                      }
                    />
                    <WriterNickname isWriter>{writer?.nickname}</WriterNickname>
                  </div>
                  <CreatedDate isWriter>
                    {dayjs(post.postData?.date).format(
                      "YYYY년 MM월 DD일 HH:mm"
                    )}
                  </CreatedDate>
                </WriteInfo>
                <CommentDiv>
                  <Comment post>
                    <CommentProfile
                      src={
                        writer?.profile_image
                          ? writer?.profile_image
                          : "/img/defaultProfile.jpg"
                      }
                    />
                    <div>
                      <div style={{ display: "flex", marginRight: "10px" }}>
                        <WriterNickname>{writer?.nickname}</WriterNickname>
                        <Content>{post.postData?.content}</Content>
                      </div>
                      <CreatedDate>
                        {dayjs(post.postData?.date).format(
                          "YYYY년 MM월 DD일 HH:mm"
                        )}
                      </CreatedDate>
                    </div>
                  </Comment>
                  {comments.map((comment, index) => (
                    <Comment
                      key={index}
                      ref={comments.length - 1 === index ? scrollRef : null}
                    >
                      <div style={{ display: "flex" }}>
                        <CommentProfile
                          src={
                            comment.profileImage
                              ? comment.profileImage
                              : "/img/defaultProfile.jpg"
                          }
                        />
                        <div>
                          <div style={{ display: "flex", marginRight: "10px" }}>
                            <WriterNickname>{comment.nickname}</WriterNickname>
                            <Content>{comment.content}</Content>
                          </div>
                          <CreatedDate>
                            {dayjs(comment.date).format(
                              "YYYY년 MM월 DD일 HH:mm"
                            )}
                          </CreatedDate>
                        </div>
                      </div>
                      {userNo === comment.userNo && (
                        <DelBtn onClick={() => delComment(comment.commentNo)}>
                          X
                        </DelBtn>
                      )}
                    </Comment>
                  ))}
                  {comments.length === 0 && (
                    <div
                      style={{
                        padding: "20px",
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <h4>아직 댓글이 없습니다 ㅋㅋ</h4>
                    </div>
                  )}
                </CommentDiv>
              </div>
              <CommentInputDiv>
                <Smile />
                <CommentForm onSubmit={handleSubmit}>
                  <CommentInput
                    value={value}
                    onChange={({ target: { value } }) => setValue(value)}
                    placeholder="댓글 달기..."
                  />
                  <CommentBtn active={value ? true : false}>게시</CommentBtn>
                </CommentForm>
              </CommentInputDiv>
            </CommentContainer>
          </PostContainer>
        </PostWrapper>
      )}
    </>
  );
};

export default PostPage;

const PostWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PostContainer = styled.div`
  min-width: 50vw;
  max-width: calc(100% - 16vw);

  display: flex;
  justify-content: space-between;
`;

const ImageContainer = styled.div`
  background-color: black;
  display: flex;
  flex-direction: column;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const PostImage = styled.img`
  display: flex;
  margin: 40px 0;
  max-width: calc(90vw - 350px);
  max-height: 80vh;
`;

const CommentContainer = styled.div`
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  border-left: 1px solid #e2e2e2;
  width: 450px;
  min-width: 350px;
  height: inherit;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const WriteInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 70px;
  width: 100%;
  border-bottom: 1px solid #e2e2e2;
`;

const WriterProfile = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-right: 10px;
`;

const WriterNickname = styled.h4`
  font-size: ${({ isWriter }) => (isWriter ? "" : "14px")};
  margin: 0 5px 0 0;
  padding: 0;
`;

const Content = styled.div`
  font-size: 14px;
`;

const CreatedDate = styled.div`
  font-size: ${({ isWriter }) => (isWriter ? "12px" : "10px")};
  color: #666;
`;

const CommentDiv = styled.div`
  display: flex;
  flex-direction: column;
  max-height: calc(80vh - 180px);
  overflow: auto;
`;

const Comment = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: ${({ post }) => (post ? "none" : "space-between")};
  width: 100%;
  height: 70px;
`;

const DelBtn = styled.p`
  color: red;
  font-weight: 600;
  width: 20px;
  text-align: center;
  &:hover {
    cursor: pointer;
  }
`;

const CommentProfile = styled.img`
  margin-right: 10px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
`;

const CommentInputDiv = styled.div`
  display: flex;
  height: 65px;
  padding: 12px 16px;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

const CommentForm = styled.form`
  display: flex;
  height: 100%;
  width: calc(100% - 32px);
  align-items: center;
`;

const CommentInput = styled.input`
  width: calc(100% - 50px);
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 16px;
`;

const CommentBtn = styled.button`
  width: 50px;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme, active }) =>
    active ? theme.palette.commentBtnActive : theme.palette.commentBtn};
  &:hover {
    cursor: ${({ active }) => (active ? "pointer" : "default")};
  }
`;
