import { useState } from "react";
import axios from "axios";
import { getToken, getUserNo, getUserNickname } from "../../utils/getToken";
import {
  Container,
  SelectedImg,
  Wrap,
  UserInfo,
  UserImage,
  Content,
  Input,
  Nickname,
  SubmitBtn,
} from "../../styles/Post/PostAfterSelectStyle";

function PostAfterSelect({ imgSrc, setShowModal, myProfileImg }) {
  const [content, setContent] = useState("");
  const onSubmit = async () => {
    const url = `${process.env.REACT_APP_URL}post`;
    const userNo = getUserNo();
    const formData = new FormData();
    formData.append("userNo", userNo);
    formData.append("content", content);
    for (let file of imgSrc.files) {
      formData.append("images", file);
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: getToken(),
      },
    };

    try {
      await axios.post(url, formData, config);
      setShowModal(false);
      alert("사진이 업로드 되었습니다.");
      window.location.reload();
    } catch (err) {
      alert(err.message);
      console.log(err);
    }
  };

  const onChangeContents = (e) => {
    setContent(e.target.value);
  };

  return (
    <Container>
      <SelectedImg src={imgSrc.URLForShow} />
      <Wrap>
        <UserInfo>
          <UserImage src={myProfileImg} />
          <Nickname>{getUserNickname()}</Nickname>
        </UserInfo>
        <Content onChange={onChangeContents}>
          <Input placeholder="문구 입력..." />
        </Content>
        <SubmitBtn onClick={onSubmit}>공유하기</SubmitBtn>
      </Wrap>
    </Container>
  );
}

export default PostAfterSelect;
