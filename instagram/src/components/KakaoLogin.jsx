import axios from 'axios';
import styled from "@emotion/styled";

function KakaoLogin() {
    const jsKey = "c45d6f34c0b90c11bf04e0fd4e4ce43c";
    window.Kakao.init(jsKey);

    function setAuthorizationToken(token) {
      if(token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete axios.defaults.headers.common['Authorization'];
      }
    }

    const kakaoLoginSuccess = async(account_email, profile, has_gender) => {
      try {
        const {data} = await axios.post('http://54.180.119.161:8080/moae/user/register', { 
          profile_nickname: profile.nickname,
          account_email,
          gender: !has_gender ? null : profile.gender || null,
        }.then(res => {
          const token = res.data.token; // 응답 데이터 토큰에서 토 큰 얻기
          localStorage.setItem('jwtToken', token); // 로컬스토리지에 저장
          setAuthorizationToken(token);
        }))
        console.log(data) 
         // data에는 token 값이 포함되어 있어야 한다
        // 토큰을 localstorage에 저장한다
        // 네비게이트를 통해 리다이렉트 해준다
        // setAuthorizationToken(localStorage.jwtToken); // reload시에도 저장될 수 있도록 header에 계속 남음
      } catch (err) {
        console.log(err)
      }
    }

    const handleLogin = () => {
        window.Kakao.Auth.login({
            scope: "profile_nickname, account_email, gender",
            success: function (authObj) {
              window.Kakao.API.request({
                url: "/v2/user/me",
                success: (res) => {
                  const kakao_account = res.kakao_account;
                  const {email, profile, has_gender } = kakao_account
                  kakaoLoginSuccess(email, profile, has_gender)
                  console.log(kakao_account);
                },
              });
            },
          });
        }

    return (
         <ImgBtn src="img/kakaoBtn.png" onClick={handleLogin} alt="kakaoBtn" />
    )
};

export default KakaoLogin;


const ImgBtn = styled.img`
  margin-top: 10px;
  width: 100px;
  cursor: pointer;
`;