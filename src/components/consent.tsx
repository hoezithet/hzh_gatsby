import React from "react";
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Slide from '@material-ui/core/Slide';
import { Link } from 'gatsby-theme-material-ui';
import { withCookies, CookiesProvider } from 'react-cookie';


class ConsentBanner extends React.Component {
  constructor(props) {
    super(props);
    
    const { cookies } = props;

    const gtCookie = cookies.get('gatsby-gdpr-google-tagmanager');
    const gaCookie = cookies.get('gatsby-gdpr-google-analytics');

    this.state = {
      accepted: gtCookie !== undefined && gaCookie !== undefined,
    };
    
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.cookies.set('gatsby-gdpr-google-tagmanager', true);
    this.props.cookies.set('gatsby-gdpr-google-analytics', true);
    this.setState({
      accepted: true,
    })
  }

  render() {
    return (
      <Box p={2} position="fixed" bottom={ 0 } width={ 1.0 } clone >
        <Slide direction="up" in={!this.state.accepted} mountOnEnter unmountOnExit >
          <Paper>
            <Grid container justify="space-between" alignItems="center" >
            <Grid item >
              { `Wij gebruiken cookies 🍪` }
            </Grid>
            <Grid item >
              <Grid container direction="column" alignItems="center" spacing={ 2 }>
                <Grid item >
                  <Button variant="contained" color="primary" disableElevation onClick={this.handleClick} >Begrepen!</Button>
                </Grid>
                <Grid item >
                  <Link to="/cookies">Wijzig voorkeuren</Link>
                </Grid>
              </Grid>
            </Grid>
            </Grid>
          </Paper>
        </Slide>
      </Box>
    );
  }
}

const WrappedConsentBanner = withCookies(ConsentBanner);

export default function CookieConsent() {
  return (
    <CookiesProvider>
      <WrappedConsentBanner />
    </CookiesProvider>
  );
}