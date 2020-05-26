import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { useRouter } from 'next/router'
import { withAuthSync } from "../utils/auth";
import Router from "next/router";

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

// 컴포넌트
import StationManage from "../components/StationManage";
import RouteManage from "../components/RouteManage";
import VocManage from "../components/VocManage";
import BoardManage from "../components/BoardManage";
import CarManage from "../components/CarManage";
import DriverManage from "../components/DriverManage";
import OperatorManage from "../components/OperatorManage";
import RiderManage from "../components/RiderManage";

const useStyles = makeStyles(theme => ({
  '@global': {
    '.Mui-selected': {
      color: '#4fa0cb',
    },
  },
  root: {
    height: '100%',
    minHeight: 687,
    width: '100%',
    flexGrow: 1,
    display: 'flex',
    backgroundColor: theme.palette.background.paper,
  },
  container1: {
    width: 209,
    backgroundColor:'#f5f6f8',
  },
  container2: {
    minWidth: 1070,
    width: '100%',
    minHeight: 687,
    height: '100%',
  },
  BigInfoText:{
    height: 87,
    width: '100%',
    fontSize: 28,
    paddingLeft:29,
    paddingTop:29,
    transform: 'perspective(100px) translateZ(0px)', // 가상의 100의 공간을 뒤에 만들고 현재 z = -100위치 
    transition: 'transform 200ms linear', // fade 효과
    '&:hover': {
      cursor: 'pointer',
      transform: 'perspective(100px) translateZ(4px)',
    },
  },
  tabs: {
    alignItems: 'stretch',
  },
  navTab: {  // 기본 Material-ui의 tab에 css가 있어서. 강제로 변경해줌.
    height: 48,
    borderBottom: '1px solid #e1e4e8',
    fontSize: 14,
    fontColor: '#212121',
    padding: 0,
    textAlign: 'left',
    alignItems: 'stretch',
    '&:hover': {
      color: '#4fa0cb',
      textShadow: 'initial',
    },
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const Info = () => {
  const classes = useStyles();
  const router = useRouter()
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    if(router.query.param == 7){
      handleChange('', 7);
    }else{
      handleChange('', 0);
    }
  }, [router.query.param]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const goInfo = () => {
    Router.push("/info")
    handleChange('', 0);
  };


  return (
    <div className={classes.root}>
      <Grid className={classes.container1}>
          <div className={classes.BigInfoText} onClick={goInfo}>정보관리 </div>
          <Tabs
          disableripple="true"
          disablefocusripple="true"
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          className={classes.tabs}
          >
          <Tab className={classes.navTab} style={{borderTop: '1px solid #e1e4e8'}} label="고객 관리" {...a11yProps(0)} />
          <Tab className={classes.navTab} label="VOC 관리" {...a11yProps(1)} />
          <Tab className={classes.navTab} label="직원 관리" {...a11yProps(2)} />
          <Tab className={classes.navTab} label="승무사원 관리" {...a11yProps(3)} />
          <Tab className={classes.navTab} label="차량 관리" {...a11yProps(4)} />
          <Tab className={classes.navTab} label="정류소 관리" {...a11yProps(5)} />
          <Tab className={classes.navTab} label="노선 관리" {...a11yProps(6)} />
          <Tab className={classes.navTab} label="공지사항 관리" {...a11yProps(7)} />
        </Tabs>
      </Grid>
      <Grid className={classes.container2}>
        <TabPanel value={value} index={0}>
          <RiderManage/>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <VocManage/>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <OperatorManage/>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <DriverManage/>
        </TabPanel>
        <TabPanel value={value} index={4}>
          <CarManage/>
        </TabPanel>
        <TabPanel value={value} index={5}>
          <StationManage/>
        </TabPanel>
        <TabPanel value={value} index={6}>
          <RouteManage/>
        </TabPanel>
        <TabPanel value={value} index={7}>
          <BoardManage/>
        </TabPanel>
      </Grid>
    </div>
  );

};

export default withAuthSync(Info);