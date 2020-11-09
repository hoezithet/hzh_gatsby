import React from "react";
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Slide from '@material-ui/core/Slide';
import { Link } from 'gatsby-theme-material-ui';
import { withCookies, CookiesProvider } from 'react-cookie';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox, { CheckboxProps } from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';


class ConsentBanner extends React.Component {
  constructor(props) {
    super(props);
    
    const { cookies } = props;

    const gtCookie = cookies.get('gatsby-gdpr-google-tagmanager');
    const gaCookie = cookies.get('gatsby-gdpr-google-analytics');

    this.state = {
      showPrefs: false,
      confirmed: !(gtCookie === undefined || gaCookie === undefined),
      checkedGtCookie: true,
      checkedGaCookie: true,
    };
    
    this.handleAccept = this.handleAccept.bind(this);
    this.handleShowPrefs = this.handleShowPrefs.bind(this);
    this.handleChangePrefs = this.handleChangePrefs.bind(this);
  }

  handleAccept() {
    this.setState({
      confirmed: true,
    });
    this.props.cookies.set('gatsby-gdpr-google-tagmanager', this.state.checkedGtCookie, { path: '/', maxAge: 2592000 });
    this.props.cookies.set('gatsby-gdpr-google-analytics', this.state.checkedGaCookie, { path: '/', maxAge: 2592000 }); 
  }
  
  handleShowPrefs() {
    this.setState({
      showPrefs: !this.state.showPrefs
    });
  }
  
  handleChangePrefs(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({[event.target.name]: event.target.checked });
  };

  render() {
    const prefs = (
      this.state.showPrefs
      ?
      <Grid item xs={12} >
        <FormGroup row>
          <FormControlLabel
            control={<Checkbox checked={this.state.checkedGaCookie} onChange={ this.handleChangePrefs } name="checkedGaCookie" color="primary" />}
            label="Cookies voor anonieme bezoekersaantallen"
          />
          <FormControlLabel
            control={<Checkbox checked={this.state.checkedGtCookie} onChange={ this.handleChangePrefs } name="checkedGtCookie" color="primary" />}
            label="Cookies voor anonieme gebruiksstatistieken"
          />
        </FormGroup>
      </Grid>
      :
      null
    );
    
    return (
      <Box p={2} position="fixed" bottom={ 0 } width={ 1.0 } clone >
        <Slide direction="up" in={ !this.state.confirmed } mountOnEnter unmountOnExit >
          <Paper>
            <Grid container spacing={2} justify="space-between" alignItems="center" >
            <Grid item >
              Wij gebruiken cookies. 🍪 Lees <Link to="/cookies">hier</Link> wat die cookies juist zijn en waarom wij ze nodig hebben.
            </Grid>

            <Grid item >
              <Grid container direction="row" alignItems="center" spacing={ 2 }>
                <Grid item >
                  <Button variant="contained" color="primary" disableElevation onClick={this.handleAccept} >Begrepen!</Button>
                </Grid>
                <Grid item >
                  <Button disableElevation onClick={this.handleShowPrefs} >{ this.state.showPrefs ? "Verberg" : "Wijzig" } voorkeuren</Button> 
                </Grid>
              </Grid>
            </Grid>

            { prefs }
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