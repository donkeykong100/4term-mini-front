import EditProfilePic from "./EditProfilePic";
import DetailsForm from "./DetailsForm";
import { Content } from "../../styles/ProfileEditPage/EditContentStyle";
import { useState, useEffect } from "react";
import axios from "../../api/config";
import { getToken, getUserNickname, getUserNo } from "./../../utils/getToken";
import { useNavigate } from "react-router-dom";

function EditContent() {
  const [userData, setUserData] = useState({});
  const [nickname, setNickname] = useState("");
  const [img, setImg] = useState(null);
  const nav = useNavigate();

  const token = getToken();
  const userNo = getUserNo();
  const userNickname = getUserNickname();

  useEffect(() => {
    axios.get(`user/profile/${userNo}`).then((res) => {
      setUserData({ ...res.data.userInfo });
      setNickname(res.data.userInfo.nickname);
      setImg(res.data.userInfo.profile_image);
    });
  }, [userNo, token]);

  const onSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();

    for (let [key, value] of Object.entries(userData)) {
      formData.append(key, value);
    }

    axios
      .patch(`user/profile/${userNo}`, formData)
      .then((res) => {
        alert(res.data.msg);
        if (res.data.success) nav(`/${userNickname}`);
        setImg(img);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      {userData ? (
        <Content>
          <EditProfilePic
            img={img}
            setImg={setImg}
            nickname={nickname}
            userData={userData}
            setUserData={setUserData}
          />
          <DetailsForm
            userData={userData}
            setUserData={setUserData}
            onSubmit={onSubmit}
          />
        </Content>
      ) : null}
    </>
  );
}

export default EditContent;
