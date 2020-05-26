import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { withAuthSync } from "../utils/auth";
import Grid from '@material-ui/core/Grid';
////// 컴포넌트 
import ReservationList from "../components/ReservationList";
import BusServiceList from "../components/BusServiceList";


const useStyles = makeStyles(theme => ({
  root: {
    margin: theme.spacing(0),
    flexGrow: 1,
    width: '100%',
    height: '100%',
    minHeight: 687,
  },
  paper1: {
    height: 44,
    width: '50%',
    fontSize: 14,
    color: '#9496a1',
    borderColor: '#e1e4e8',
    boxShadow: 'none',
    display: "flex",
    alignItems: "center", // 세로에서 센터
    justifyContent: 'center', //가로에서 센터
    '&:hover': {
      color: '#4fa0cb',
      cursor: 'pointer',
    },
  },
  paper2: {
    width: '100%',
    height: '100%',
    minHeight: 643,
  },

}));

const Home = () => {
  const classes = useStyles();
  // 메뉴선택 (운행 리스트 <-> 예약 리스트) 전환
  const [listCategory, setListCategory] = useState(true);

  // 메뉴선택 (운행 리스트 <-> 예약 리스트) 전환
    const handleChangeList = e => {
      setListCategory(e);
  }
  return (
    <React.Fragment>
      {listCategory ? 
        <Grid container spacing={0}>
          <Grid item xs className={classes.paper1} onClick={() => handleChangeList(true)} style={{borderRight: '1px solid #e1e4e8',backgroundColor:"#4fa0cb",color:"white", fontWeight: 'bold',}}>
              운행 리스트
          </Grid>
          <Grid item xs className={classes.paper1} onClick={() => handleChangeList(false)} style={{borderBottom: '1px solid #e1e4e8'}}>
              예약 리스트
          </Grid>
        </Grid>
        : 
        <Grid container spacing={0}>
          <Grid item xs className={classes.paper1} onClick={() => handleChangeList(true)} style={{borderRight: '1px solid #e1e4e8', borderBottom: '1px solid #e1e4e8'}}>
              운행 리스트
          </Grid>
          <Grid item xs className={classes.paper1} onClick={() => handleChangeList(false)} style={{backgroundColor:"#4fa0cb",color:"white", fontWeight: 'bold'}}>
              예약 리스트
          </Grid>
        </Grid>
      }
      <Grid container spacing={0} className={classes.paper2}>
        {listCategory ? 
          <BusServiceList/>
        : 
          <ReservationList/>
        }
              
      </Grid>
       
        
      
    </React.Fragment>
  );

};
export default withAuthSync(Home);