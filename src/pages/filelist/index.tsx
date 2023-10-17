import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import toast from 'react-hot-toast';
import { FileListBox, SkeletonUIBox } from '../../components';
import { actionCreators } from '../../state';
import { getFileSize, getDate } from '../../utils';
import * as S from './styled';

export const FileListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listZero, setListZero] = useState(false); //test: true
  const SkeletonUIRandomWidth = ['50', '55', '60', '65', '70', '75', '80'];
  const dispatch = useDispatch();
  const { SetDownloadFileProps } = bindActionCreators(actionCreators, dispatch);
  const [fileList, setFileList] = useState<
    {
      filename: string;
      fileId: string;
      size: number;
      uploadDate: string;
      isEncrypted: boolean;
    }[]
  >();

  const getFileList = async () => {
    await axios({
      method: 'get',
      url: `${import.meta.env.VITE_APP_BACKEND_BASEURL}/list`,
    })
      .then((res) => {
        setFileList(res.data.list); //파일리스트 요소 갯수에 따른 핸들링 추가예정
        if (res.data.numberOfList === 0) {
          setListZero(true);
        }
        setTimeout(() => {
          setLoading(true); //loading 확인하고싶으면 false로 바꿔주세요.
        }, 1000);
      })
      .catch((err) => {
        toast.error(`파일 리스트를 불러오는데 실패했습니다. ${err.response.status}`, {
          duration: 3000,
          icon: '❌',
        });
      });
  };
  useEffect(() => {
    getFileList();
  }, []);
  return (
    <>
      {loading ? (
        <>
          <S.FileListPageContainer>
            {!listZero ? (
              <>
                {fileList?.map((item, index) => (
                  <FileListBox
                    key={index}
                    filename={item.filename}
                    fileId={item.fileId}
                    size={getFileSize(item.size)}
                    uploadDate={getDate(item.uploadDate)}
                    isEncrypted={item.isEncrypted}
                    click={() => {
                      if (item.isEncrypted) {
                        navigate(`/check/${item.fileId}`);
                      } else {
                        SetDownloadFileProps({
                          fileId: item.fileId,
                          isEncrypted: item.isEncrypted,
                          token: null,
                        });
                        navigate(`/dl/${item.fileId}`);
                      }
                    }}
                  />
                ))}
              </>
            ) : (
              <S.FileListZero>업로드된 파일이 없습니다.</S.FileListZero>
            )}
          </S.FileListPageContainer>
        </>
      ) : (
        <>
          <S.FileListPageContainer>
            <SkeletonUIBox randomWitdh={SkeletonUIRandomWidth[Math.floor(Math.random() * 6)]} />
            <SkeletonUIBox randomWitdh={SkeletonUIRandomWidth[Math.floor(Math.random() * 6)]} />
            <SkeletonUIBox randomWitdh={SkeletonUIRandomWidth[Math.floor(Math.random() * 6)]} />
            <SkeletonUIBox randomWitdh={SkeletonUIRandomWidth[Math.floor(Math.random() * 6)]} />
            <SkeletonUIBox randomWitdh={SkeletonUIRandomWidth[Math.floor(Math.random() * 6)]} />
            <SkeletonUIBox randomWitdh={SkeletonUIRandomWidth[Math.floor(Math.random() * 6)]} />
            <SkeletonUIBox randomWitdh={SkeletonUIRandomWidth[Math.floor(Math.random() * 6)]} />
          </S.FileListPageContainer>
        </>
      )}
    </>
  );
};
