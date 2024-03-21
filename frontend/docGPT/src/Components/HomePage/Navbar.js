import React, { useState } from 'react';
import Logo from '../Assets/docGPTAltLogo.svg';
import { Box, Drawer, ListItem, ListItemButton, ListItemIcon, ListItemText, listItemTextClasses, List } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import { HiOutlineBars3 } from "react-icons/hi2";

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(false)
  const menuOptions = [
    {
      text: "Home",
      icon: <HomeIcon />
    },
    {
      text: "Login",
      icon: <InfoIcon />
    }
  ];

  return (
    <nav>
      <div className="nav-logo-container">
        <img src={Logo} alt="DocGPT" />
      </div>
      <div className="navbar-links-container">
        <a href="">Home</a>
        <a href="">Info</a>
        <a href="/login">
          <button className="primary-button">
            Login
          </button>
        </a>
      </div>
      <div className="navbar-menu-container">
        <HiOutlineBars3 onClick={() => setOpenMenu(true)} />
      </div>
      <Drawer open={openMenu} onClose={() => setOpenMenu(false)} anchor="right"  >
        <Box
          width="50vw"
          role="presentation"
          onClick={() => setOpenMenu(false)}
          onkeyDown={() => setOpenMenu(false)}
        >
          <List style={{ width: '100%'}}>
            {menuOptions.map((item) => (
              <ListItem key={item.text} disablePadding >
                <ListItemButton style={{ width: '100%'}} sx={{alignItems:'center'}}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text}  sx={{ fontSize: '20px !important' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </nav >
  )
}

export default Navbar