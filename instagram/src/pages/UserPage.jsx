import Navigation from "./Navigation";
import UserHeader from "../components/UserPage/UserHeader";
import UserPostings from "../components/UserPage/UserPostings";
import HeaderBaseline from "../components/UserPage/HeaderBaseline";
import { Container, PageContainer } from "../styles//UserPage/UserPageStyle";
import { useState, useEffect } from "react";
import axios from "../api/config";
import { getUserNickname, getUserNo } from "../utils/getToken";
import { useLocation, useNavigate, useParams } from "react-router-dom";

function UserPage() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  let { nickname } = useParams();
  const userNo = getUserNo();
  const userNickname = getUserNickname();
  const [isMyPage, setIsMyPage] = useState(false);
  const [postData, setPostData] = useState({});
  const [userInfo, setUserInfo] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (pathname === "/undefined") navigate("/main");
  }, [navigate, pathname]);

  useEffect(() => {
    if (nickname === userNickname) setIsMyPage(true);
    axios.get(`post/profile/${userNo}`).then((res) => {
      setPostData({ ...res.data });
    });
  }, [userNo, nickname, userNickname]);

  useEffect(() => {
    axios.get(`user/profile/${userNo}`).then((res) => {
      setUserInfo({ ...res.data.userInfo });
    });
    if (!(userInfo.name === undefined && userInfo.nickname === undefined))
      setIsLoaded(true);
  }, [userNo, userInfo.name, userInfo.nickname]);

  const OtherPage = () => {
    const [otherNo, setOtherNo] = useState(null);
    const [otherPost, setOtherPost] = useState({});
    const [otherInfo, setOtherInfo] = useState({});
    useEffect(() => {
      (async () => {
        const {
          data: { user },
        } = await axios.get(`user/search/${nickname}`);
        setOtherNo(user[0].no);
      })();
    }, [otherNo]);

    useEffect(() => {
      axios.get(`post/profile/${otherNo}`).then((res) => {
        setOtherPost({ ...res.data });
      });
    }, [otherNo]);

    useEffect(() => {
      axios
        .get(`user/profile/${otherNo}`)
        .then((res) => setOtherInfo({ ...res.data.userinfo }));
    }, [otherNo]);

    return (
      <>
        {!(otherInfo.name === undefined && otherInfo.nickname === undefined) ? (
          <PageContainer>
            <Navigation />
            <Container>
              <UserHeader
                isMyPage={isMyPage}
                userInfo={otherInfo}
                postData={otherPost}
              />
              <HeaderBaseline />
              <UserPostings postData={otherPost} />
            </Container>
          </PageContainer>
        ) : null}
      </>
    );
  };

  return (
    <>
      {isLoaded ? (
        isMyPage ? (
          <PageContainer>
            <Navigation />
            <Container>
              <UserHeader
                isMyPage={isMyPage}
                userInfo={userInfo}
                postData={postData}
              />
              <HeaderBaseline />
              <UserPostings postData={postData} />
            </Container>
          </PageContainer>
        ) : (
          <OtherPage />
        )
      ) : null}
    </>
  );
}

export default UserPage;
