import { useState, MouseEvent } from 'react'
import Link from 'next/link'
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import LoginIcon from '@mui/icons-material/Login'
import { color } from '@mui/system'
import { useRouter } from 'next/router'

function MainNavigation() {
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null)
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

  const router = useRouter()
  const { data: session } = useSession()

  const handleOpenNavMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }
  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const pages = [
    { displayName: '我的課程', path: '/courses' },
    { displayName: '課程管理', path: '/courses/edit' },
    { displayName: '關於我們', path: '/about' },
    // { displayName: 'course title', path: 'course/courseid' },
  ]
  const settings = [
    {
      title: '帳號管理',
      fn: () => {
        router.push('/account')
      },
    },
    { title: '修課紀錄', fn: () => {} },
    {
      title: '登出',
      fn: () => {
        signOut()
      },
    },
  ]

  return (
    <AppBar
      id="main-navigation"
      component="nav"
      position="sticky"
      sx={{ color: 'secondary', boxShadow: 'none' }}
    >
      <Container maxWidth="md">
      <Toolbar disableGutters>
          <RemoveRedEyeIcon
            sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, color: '#fff' }}
          />
          <Link href={'/'} passHref legacyBehavior>
            <Typography
              variant="h6"
              noWrap
              component="a"
              //TODO
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.0.6rem',
                color: '#fff',
                textDecoration: 'none',
              }}
            >
              Meet-Trol
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page, index) => {
                return (
                  <Link
                    key={page.displayName}
                    href={page.path}
                    passHref
                    legacyBehavior
                  >
                    <MenuItem
                      onClick={handleCloseNavMenu}
                      component="a"
                      sx={{ my: 2, display: 'block' }}
                    >
                      {page.displayName}
                    </MenuItem>
                  </Link>
                )
              })}
            </Menu>
          </Box>
          <RemoveRedEyeIcon
            sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }}
          />
          <Link href={'/'} passHref legacyBehavior>
            <Typography
              variant="h5"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Meet-Trol
            </Typography>
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => {
              return (
                <Button
                  href={page.path}
                  key={page.displayName}
                  onClick={handleCloseNavMenu}
                  LinkComponent={Link}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.displayName}
                </Button>
              )
            })}
          </Box>
          {/* 帳號頭像 */}
          <Box sx={{ flexGrow: 0 }}>
            {session ? (
              <Tooltip title={session.user.name}>
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{ width: '40px', height: '40px' }}
                    src={session.user.image}
                    alt="ProfilePhoto"
                  >
                    <Image
                      src={session.user.image}
                      alt="ProfilePhoto"
                      width={200}
                      height={200}
                    ></Image>
                  </Avatar>
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title={'SignIn'}>
                <Button
                  variant="contained"
                  onClick={() => {
                    window.open('/auth/signin')
                  }}
                  sx={{
                    marginPadding: '8px',
                    borderRadius: '6px',
                    boxShadow: '0',
                  }}
                >
                  <Box
                    display={'flex'}
                    flexDirection={'row'}
                    alignItems={'center'}
                  >
                    <Typography sx={{ color: '#fff' }}>SIGN IN</Typography>
                  </Box>
                </Button>
              </Tooltip>
            )}
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.title} onClick={setting.fn}>
                  <Typography textAlign="center">{setting.title}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default MainNavigation
