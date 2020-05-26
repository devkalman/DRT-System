import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import request from "../lib/request";
import InputBase from '@material-ui/core/InputBase';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Fade from '@material-ui/core/Fade';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import arrayMove from 'array-move';
import CircularProgress from "@material-ui/core/CircularProgress";
import { loadStation } from "../lib/station/actions";
import { loadRouteData } from "../lib/route/actions";

const useStyles = makeStyles(theme => ({
  '@global': {
    '.MuiDialog-paperWidthFalse': {
      height: 669,
    },
    '.MuiPaper-rounded': {
      borderRadius: 0,
    },
  },
  dialogTitle: {
    display: "flex",
    justifyContent: 'center',
    alignItems: "center",
    fontSize: 30,
  },
  dialogContent: {
    minWidth: 1150,
    maxWidth: '100%',
    height: 481,
    display: "flex",
    padding: 0,
  },
  container1: {
    border: "1px solid #dee0e8",
    minWidth: 450,
    maxWidth: 'auto',
    height: 'auto',
    display: "flex",
    alignContent: 'start',
  },
  container2: {
    border: "1px solid #dee0e8",
    minWidth: 450,
    maxWidth: 'auto',
    display: "flex",
    alignContent: 'start',
  },
  leftMenu: {
    height: 54,
    width: '27%',
    paddingLeft: 18,
    backgroundColor: '#f5f6f8',
    borderRight: '1px solid #dee0e8',
  },
  inputMenu: {
    minWidth: 300,
    width: '73%',
    height: 54,
  },
  searchMenu: {
    minWidth: 300,
    width: '100%',
    height: 54,
    backgroundColor: '#f5f6f8',
    borderBottom: '1px solid #dee0e8',
  },
  searchStationList: {
    alignItems: "center",
    height: 55,
    backgroundColor: '#f5f6f8',
    borderBottom: "1px solid #dee0e8",
  },
  stationButton: {
    width: 60,
    height: 54,
    backgroundColor: 'blue',
  },
  modalButton: {
    marginTop: 20,
    width: 145,
    height: 48,
    backgroundColor: '#ffffff',
    border: 'solid 1px #d0d1d5',
    display: "flex",
    color: '#212121',
    fontSize: 16,
    lineHeight: 2,
    justifyContent: 'center',
    alignItems: "center",
    transform: 'perspective(100px) translateZ(0px)', // 가상의 100의 공간을 뒤에 만들고 현재 z = -100위치 
    transition: 'transform 200ms linear', // fade 효과
    '&:hover': {
      cursor: 'pointer',
      color: '#6fc9ef',
      transform: 'perspective(100px) translateZ(2px)', // 가상의 100의 공간을 만들고, hover를 하면 5px만큼 튀어나와보이는 착시
    },
  },
  modalButtonNone: {
    backgroundColor: '#d0d1d5',
    marginTop: 20,
    width: 145,
    height: 48,
    display: "flex",
    color: '#fefefe',
    fontSize: 16,
    lineHeight: 2,
    justifyContent: 'center',
    alignItems: "center",
  },
  allCenter: {
    display: "flex",
    alignItems: "center",
    justifyContent: 'left',
  },
  bigText: {
    fontSize: 16,
    color: '#212121',
  },
  routeName: {
    width: '93%',
    height: 34,
    marginLeft: 15,
    border: 'solid 1px #d0d1d5',
    paddingLeft: 9,
    fontSize: 13,
  },
  popupClose: {
    position: 'absolute',
    top: 14,
    right: 14,
    cursor: 'pointer',
  },

  // 모달창 디자인
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBox: {
    width: 290,
    height: 148,
    backgroundColor: theme.palette.background.paper,
    boxShadow: 'none',
    '&:focus': {
      outline: 'none',
    }
  },
  modalTitle: {
    height: 45,
    backgroundColor: '#223152',
    color: '#ffffff',
    fontSize: 18,
    paddingLeft: 21,
    paddingTop: 12,
  },
  modalClose: {
    float: 'right',
    marginRight: 15,
    padding: 5,
    '&:hover': {
      cursor: 'pointer',
    },
  },
  modalContentImg: {
    marginRight: 10,
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

const RouteModal = (openstate) => {
  const classes = useStyles();
  const [query, setQuery] = useState({ value: '' });
  const [routeName, setRouteName] = useState('');
  const [startNo, setStartNo] = useState('');
  const [startName, setStartName] = useState('');
  const [endNo, setEndNo] = useState('');
  const [endName, setEndName] = useState('');
  const [modifyMode, setModifyMode] = useState(false);
  const [stationArray, setStationArray] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const [loading, setLoading] = useState(false);
  var tempA = [];

  // 모달 팝업 열고 닫을때 실행 
  useEffect(() => {
    openstate.stationLoad('');
    if (openstate.routeNum) {
      openstate.routeLoad(openstate.routeNum);
    }
  }, [openstate.routeOpen]);

  // 노선 정보 상세창 클릭할때 실행 
  useEffect(() => {
    if (openstate.routeOne.data && openstate.routeOne.data.stations) {
      if (openstate.routeOne.data.stations.length > 0) {
        setRouteName(openstate.routeOne.data.route_nm);
        setStartName(openstate.routeOne.data.stations[0].station_nm);
        setStartNo(openstate.routeOne.data.stations[0].station_no);
        setEndName(openstate.routeOne.data.stations[openstate.routeOne.data.stations.length - 1].station_nm);
        setEndNo(openstate.routeOne.data.stations[openstate.routeOne.data.stations.length - 1].station_no);
        for (let i = 1; i < openstate.routeOne.data.stations.length - 1; i++) { // 기점, 종점을 제외한 중간 정류소들만 넣는다. 인덱스 1 ~ length-1
          tempA = [
            ...tempA,
            {
              id: openstate.routeOne.data.stations[i].station_no,
              stationNm: openstate.routeOne.data.stations[i].station_nm,
              idx: i - 1,   //임시 배열이라 해도 배열의 인덱스는 0부터 시작하므로 초기값 0을 넣어줌. 
            }
          ]
        }
        setStationArray(tempA);
      }
    }
  }, [openstate.routeOne.data, modifyMode]);

  const handleClose = () => {
    openstate.setRouteOpen(false);
    openstate.setRouteNum(false);
    setModifyMode(false);
    setRouteName('');
    setStartName('');
    setEndName('');
    setQuery({ value: '' });
    setStationArray([]);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleCloseModify = e => {
    setQuery({ value: '' });
    setModifyMode(false);
    openstate.stationLoad('');
  }
  const handleQuery = e => {
    setQuery({ value: e.target.value });
  };
  // 검색 엔터키 
  const handleEnterkey = e => {
    if (event.keyCode == 13) {
      handleStationSearch();
    }
  };
  // 정류소 검색 
  const handleStationSearch = e => {
    openstate.stationLoad(query.value, true);
  };
  // no 넘버를 받아서 최종 처리
  const handleStart = (no, nm) => {
    setStartName(nm);
    setStartNo(no);
  };
  // no 넘버를 받아서 최종 처리
  const handleEnd = (no, nm) => {
    setEndName(nm);
    setEndNo(no);
  };
  const handleDelete = (no) => {
    setStationArray(stationArray.filter(stationArray => stationArray.id !== no));
  };

  const handleDeleteRoute = () => {
    setOpenModal(true);
  };

  const handleUp = (idx) => {
    if (idx !== 0) {
      setStationArray(arrayMove(stationArray, idx, idx - 1));
    }
  };
  const handleDown = (idx) => {
    setStationArray(arrayMove(stationArray, idx, idx + 1));

  };
  const handleAddStation = (no, nm) => {
    setStationArray([
      ...stationArray,
      {
        id: no,
        stationNm: nm,
        idx: stationArray.length,
      }
    ]);
    return true;
  };
  const startClear = () => {
    setStartName('');
    setStartNo('');
  }
  const endClear = () => {
    setEndName('');
    setEndNo('');
  }
  // 목록초기화 , 새로고침
  const handleRefresh = () => {
    setQuery({ value: '' });
    openstate.stationLoad('');
  };
  const handleRouteNm = e => {
    setRouteName(e.target.value);
  };
  const handleRouteModify = () => {
    setModifyMode(true);
  };

  const handleRouteDeleteSave = async () => {
    try {
      const options = {
        method: "PUT",
      };
      const result = await request(`/api/v1/route/${openstate.routeNum}/deactive`, options);
      console.log("]-----]  result [-----[ ", result);
    } catch (error) {
      console.log("]-----] error [-----[ ", error);
    } finally {
    }
    handleClose()
    handleCloseModal();
    openstate.routeLoad('');
    return true;
  };


  const handleRouteModifySave = async () => {
    // 기점을 배열에 추가  .push()는 배열의 맨 끝에, .unshift()는 배열의 맨 앞에 원소를 추가합니다.
    setStationArray(stationArray.unshift({
      id: startNo,
      stationNm: startName,
      idx: 0,
    }));
    // 종점을 배열에 추가  .push()는 배열의 맨 끝에, .unshift()는 배열의 맨 앞에 원소를 추가합니다.
    setStationArray(stationArray.push({
      id: endNo,
      stationNm: endName,
      idx: 0,
    }));

    const dataArr = [];
    for (let i = 0; i < stationArray.length; i++) {
      let turnNo = Number(i + 1) + "";
      dataArr[i] = { route_station_turn_no: turnNo, route_station_gb: 'UP', station_no: stationArray[i].id };
    }

    try {
      const options = {
        method: "POST",
        data: {
          "route_active_fl": "ACTIVE",
          "route_nm": routeName,
          "stationsDto": dataArr,
        },
      };
      const result = await request(`/api/v1/route/${openstate.routeNum}`, options);
      console.log("]-----] RouteModifySave result [-----[ ", result);
    } catch (error) {
      console.log("]-----] RouteModifySave error [-----[ ", error);
    } finally {
    }
    handleClose();
    openstate.routeLoad('');
    return true;
  };

  const handleRouteSave = async () => {
    // 기점을 배열에 추가  .push()는 배열의 맨 끝에, .unshift()는 배열의 맨 앞에 원소를 추가합니다.
    setStationArray(stationArray.unshift({
      id: startNo,
      stationNm: startName,
      idx: 0,
    }));
    // 종점을 배열에 추가  .push()는 배열의 맨 끝에, .unshift()는 배열의 맨 앞에 원소를 추가합니다.
    setStationArray(stationArray.push({
      id: endNo,
      stationNm: endName,
      idx: 0,
    }));

    const dataArr = [];
    for (let i = 0; i < stationArray.length; i++) {
      let turnNo = Number(i + 1) + "";
      dataArr[i] = { route_station_gb: 'UP', route_station_turn_no: turnNo, station_no: stationArray[i].id };
    }

    try {
      const options = {
        method: "POST",
        data: {
          "route_active_fl": "ACTIVE",
          "route_nm": routeName,
          "stationsDto": dataArr,
        },
      };
      const result = await request(`/api/v1/route`, options);
      console.log("]-----] Route RouteSaveStation result [-----[ ", result);
    } catch (error) {
      console.log("]-----] Route RouteSaveStation error [-----[ ", error);
    } finally {
    }
    handleClose();
    return true;
  };

  return (
    <div>

      <Dialog open={openstate.routeOpen} onClose={handleClose}
        maxWidth={false}
        fullWidth
        disableBackdropClick >
        <DialogTitle disableTypography={true} className={classes.dialogTitle} >
          {modifyMode && openstate.routeNum ?
            "노선 정보 수정" : !openstate.routeNum ?
              "노선 등록" : "노선 정보"
          }
        </DialogTitle>
        <img src="static/popup-close.svg" alt="노선정보 팝업 닫기" className={classes.popupClose} onClick={handleClose} />

        <DialogContent >
          {/* 전체 그리드 */}
          <Grid className={classes.dialogContent}>
            {/* 컨테이너 1 */}
            <Grid container className={classes.container1} style={{ alignContent: 'start' }}>
              {/* 노선명 */}
              <Grid container style={{ alignContent: 'start' }}>
                <Grid className={clsx(classes.bigText, classes.allCenter, classes.leftMenu)}>노선명
              <span style={{ color: '#d62b28' }}>*</span>
                </Grid>
                <Grid className={clsx(classes.allCenter, classes.inputMenu)}>
                  {(!openstate.routeNum || modifyMode) ?
                    <input type="text" onChange={handleRouteNm} value={routeName} maxLength="15" className={classes.routeName} placeholder="노선명" />
                    : <input type="text" disabled value={routeName} maxLength="15" className={classes.routeName} placeholder="노선명" />
                  }
                </Grid>
              </Grid>
              {/* 기점 */}
              <Grid container style={{ alignContent: 'start', borderTop: '1px solid #dee0e8' }}>
                <Grid className={clsx(classes.bigText, classes.allCenter, classes.leftMenu)}>기점
              <span style={{ color: '#d62b28' }}>*</span>
                </Grid>
                <Grid className={clsx(classes.allCenter, classes.inputMenu)}>

                  {(!openstate.routeNum || modifyMode) ?
                    <Paper style={{ width: '93%', height: 34, marginLeft: 16, paddingTop: 3, border: "1px solid #d0d1d5", display: "flex", boxShadow: 'none', borderRadius: 0, float: 'left' }}>
                      <InputBase disabled style={{ color: '#8d939b', width: '90%', marginLeft: 9, fontSize: 14, }} placeholder="기점을 선택해주세요" value={startName} />
                      {startName ?
                        <IconButton style={{ padding: 0, paddingRight: 3 }} type="submit" onClick={startClear} className={classes.iconButton}><CloseIcon /></IconButton>
                        : ''}
                    </Paper>
                    :
                    <Paper style={{ width: '93%', height: 34, marginLeft: 16, paddingTop: 3, border: "1px solid #d0d1d5", display: "flex", boxShadow: 'none', borderRadius: 0, float: 'left' }}>
                      <InputBase disabled style={{ color: '#8d939b', width: '90%', marginLeft: 9, fontSize: 14, }} placeholder="기점을 선택해주세요" value={startName} />
                    </Paper>
                  }
                </Grid>
              </Grid>

              {/* 추가되는 정류소들 */}
              {stationArray &&
                stationArray.length > 0 &&
                <Grid container style={{ alignContent: 'start', height: 315, overflow: 'auto', borderTop: '1px solid #dee0e8' }}>

                  {stationArray &&
                    stationArray.length > 0 &&
                    stationArray.map((row, index) => (
                      <Grid container key={index} style={{ alignContent: 'start', borderBottom: '1px solid #dee0e8' }}>
                        <Grid className={clsx(classes.bigText, classes.allCenter, classes.leftMenu)}>정류소추가 {index + 1}</Grid>

                        {!openstate.routeNum || modifyMode ?
                          <Grid className={clsx(classes.allCenter, classes.inputMenu)}>
                            <Paper style={{ width: '60%', height: 34, marginLeft: 16, paddingTop: 3, border: "1px solid #d0d1d5", display: "flex", boxShadow: 'none', borderRadius: 0, float: 'left' }}>
                              <InputBase disabled style={{ color: '#8d939b', width: '90%', marginLeft: 9, fontSize: 14, }} value={row.stationNm + " | " + row.id} />
                            </Paper>

                            <Grid style={{ marginLeft: 'auto' }} />
                            <Grid onClick={() => handleDelete(row.id)}><img src="static/buttonicon/btn-route-delete.svg" alt="" style={{ cursor: 'pointer', marginTop: 5 }} /> </Grid>
                            <Grid onClick={() => handleUp(index)}><img src="static/buttonicon/btn-route-up.svg" alt="" style={{ cursor: 'pointer', marginLeft: 5, marginTop: 5 }} /> </Grid>
                            <Grid onClick={() => handleDown(index)}><img src="static/buttonicon/btn-route-down.svg" alt="" style={{ cursor: 'pointer', marginRight: 10, marginLeft: 5, marginTop: 5 }} /> </Grid>
                          </Grid>
                          :
                          <Grid className={clsx(classes.allCenter, classes.inputMenu)}>
                            <Paper style={{ width: '60%', height: 34, marginLeft: 16, paddingTop: 3, border: "1px solid #d0d1d5", display: "flex", boxShadow: 'none', borderRadius: 0, float: 'left' }}>
                              <InputBase disabled style={{ color: '#8d939b', width: '90%', marginLeft: 9, fontSize: 14, }} value={row.stationNm + " | " + row.id} />
                            </Paper>
                          </Grid>
                        }

                      </Grid>
                    ))}
                </Grid>
              }

              {/* 종점 */}
              <Grid container style={{ alignContent: 'start', borderBottom: '1px solid #dee0e8', borderTop: '1px solid #dee0e8' }}>
                <Grid className={clsx(classes.bigText, classes.allCenter, classes.leftMenu)}>종점
              <span style={{ color: '#d62b28' }}>*</span>
                </Grid>
                <Grid className={clsx(classes.allCenter, classes.inputMenu)}>
                  {(!openstate.routeNum || modifyMode) ?
                    <Paper style={{ width: '93%', height: 34, marginLeft: 16, paddingTop: 3, border: "1px solid #d0d1d5", display: "flex", boxShadow: 'none', borderRadius: 0, float: 'left' }}>
                      <InputBase disabled style={{ color: '#8d939b', width: '90%', marginLeft: 9, fontSize: 14, }} placeholder="종점을 선택해주세요" value={endName} />
                      {endName ?
                        <IconButton style={{ padding: 0, paddingRight: 3 }} type="submit" onClick={endClear} className={classes.iconButton}><CloseIcon /></IconButton>
                        : ''}
                    </Paper>
                    :
                    <Paper style={{ width: '93%', height: 34, marginLeft: 16, paddingTop: 3, border: "1px solid #d0d1d5", display: "flex", boxShadow: 'none', borderRadius: 0, float: 'left' }}>
                      <InputBase disabled style={{ color: '#8d939b', width: '90%', marginLeft: 9, fontSize: 14, }} placeholder="종점을 선택해주세요" value={endName} />
                    </Paper>
                  }
                </Grid>
              </Grid>
            </Grid>

            {/* 컨테이너 2 */}
            <Grid container className={classes.container2} style={{ marginLeft: 10 }} >
              <Grid container style={{ alignContent: 'start' }}>
                <Grid className={clsx(classes.allCenter, classes.searchMenu)}>
                  {(!openstate.routeNum || (openstate.routeNum && modifyMode)) && // ***** 등록화면 , 수정모드에서만 검색창 출력  

                    <Paper style={{ width: '83%', height: 30, marginLeft: 16, paddingTop: 3, border: "1px solid #d0d1d5", display: "flex", boxShadow: 'none', borderRadius: 0, float: 'left' }}>
                      <InputBase onChange={handleQuery} onKeyUp={handleEnterkey} value={query.value} style={{ color: '#8d939b', width: '90%', marginLeft: 16 }} placeholder="정류소명 검색" />
                      <IconButton onClick={handleStationSearch} style={{ padding: 0, paddingRight: 3 }}><SearchIcon /></IconButton>
                    </Paper>
                  }
                  {(!openstate.routeNum || (openstate.routeNum && modifyMode)) && // ***** 등록화면 , 수정모드에서만 검색창 출력  
                    <Button size='small' onClick={handleRefresh}>
                      <RefreshIcon />
                    </Button>
                  }
                </Grid>
              </Grid>

              {(!openstate.routeNum || modifyMode) &&
                <Grid container style={{ width: '100%', height: 425, overflow: 'auto', alignContent: 'start' }}>
                  {openstate.station.data &&
                    openstate.station.data.length > 0 &&
                    openstate.station.data.map((row, index) => (
                      <Grid container className={classes.searchStationList} key={row.station_no} >
                        <Grid style={{ marginLeft: 16 }}>
                          <Typography style={{ fontSize: 14, color: '#313131' }}>{row.station_nm} | 정류소 {row.station_no}</Typography>
                          <Typography style={{ fontSize: 12, color: '#717171' }}>{row.station_address} </Typography>
                        </Grid>
                        <Grid style={{ marginLeft: 'auto' }} />   {/* 버튼이 사라져도 계속 우측정렬을 위해 넣은 빈 Grid */}
                        {startName == '' ?
                          <Grid onClick={() => handleStart(row.station_no, row.station_nm)}><img src="static/buttonicon/btn-route-start.svg" alt="기점추가" style={{ justifyItems: 'end', cursor: 'pointer' }} /> </Grid>
                          : ''
                        }
                        {endName == '' ?
                          <Grid onClick={() => handleEnd(row.station_no, row.station_nm)}><img src="static/buttonicon/btn-route-end.svg" alt="종점추가" style={{ cursor: 'pointer' }} /> </Grid>
                          : <Grid style={{ width: 61 }}></Grid>
                        }
                        {stationArray.length < 5 &&
                          <Grid onClick={() => handleAddStation(row.station_no, row.station_nm)}><img src="static/buttonicon/btn-route-add.svg" alt="정류소추가" style={{ cursor: 'pointer' }} /> </Grid>
                        }
                      </Grid>
                    ))}
                </Grid>
              }

            </Grid>
          </Grid>  {/* 전체 그리드 닫기 */}
          {modifyMode && openstate.routeNum ?
            <Grid container style={{ justifyContent: 'center', height: 80 }} >
              <div className={classes.modalButton} onClick={handleCloseModify}>이전</div>
              <div onClick={handleRouteModifySave} style={{ backgroundColor: '#223152', color: '#fefefe', marginLeft: 10 }} className={classes.modalButton} >완료</div>
            </Grid>
            : !openstate.routeNum ?
              <Grid container style={{ justifyContent: 'center', height: 80 }} >
                <div className={classes.modalButton} onClick={handleClose}>취소</div>
                {(routeName && startNo && endNo) !== '' ?
                  <div onClick={handleRouteSave} style={{ backgroundColor: '#223152', color: '#fefefe', marginLeft: 10 }} className={classes.modalButton} >등록</div>
                  :
                  <div className={classes.modalButtonNone} style={{ marginLeft: 10 }} >등록</div>
                }
              </Grid>
              :
              <Grid container style={{ justifyContent: 'center', height: 80 }} >
                <div className={classes.modalButton} onClick={handleDeleteRoute}>삭제</div>
                <div className={classes.modalButton} style={{ marginLeft: 10 }} onClick={handleClose}>취소</div>
                <div onClick={handleRouteModify} style={{ backgroundColor: '#223152', color: '#fefefe', marginLeft: 10 }} className={classes.modalButton} >수정</div>
              </Grid>
          }

        </DialogContent>
      </Dialog>

      <Modal
        disableEnforceFocus   // 오토포커스 테두리 삭제
        disableAutoFocus
        className={classes.modal}
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}>
        <Fade in={openModal}>
          <div className={classes.modalBox}>
            <div className={classes.modalTitle}>노선 삭제
            <img src="/static/modal_x.png"
                alt="logo"
                className={classes.modalClose}
                onClick={handleCloseModal}
              />
            </div>
            <div style={{ margin: 30, marginTop: 20 }}>
              <div style={{ fontSize: 14, marginBottom: 13 }}>· 해당 노선을 삭제 하시겠습니까?</div >
              <div style={{ marginLeft: 25, marginTop: 20 }}>
                <img
                  src="/static/popup_cancel.png"
                  alt="logo"
                  onClick={handleCloseModal}
                  className={classes.modalContentImg}
                />
                <img
                  src="/static/popup_delete.png"
                  alt="logo"
                  onClick={handleRouteDeleteSave}
                  className={classes.modalContentImg}
                />
              </div>
            </div>
          </div>
        </Fade>
      </Modal>

    </div>
  );
}

const mapStateToProps = state => {
  return {
    auth: state.auth,
    station: state.station.data,
    routeOne: state.route.data,
  };
};

const mapDispatchToProps = dispatch => ({
  stationLoad: (num, search) => dispatch(loadStation(num, search)),
  routeLoad: (num) => dispatch(loadRouteData(num)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RouteModal);