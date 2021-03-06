import React, { Component } from "react";
import { Updates } from "expo";
import {
  StyleSheet,
  View,
  Button,
  FlatList,
} from "react-native";
import {
  AppFonts,
  AppStyles,
  AppSizes,
  getRelativeWidth,
  getRelativeHeight,
  colors,
} from "../theme/index";
import {
  getCompetitionTeam,
  renderEmptyComponent,
} from "../utils/utils";
import ScaledText from "../components/ScaledText";
import TeamCard from "../components/TeamCard";
import PopupModal from "../components/PopupModal";

const AvailableCompetitionsIds = [2000,2001,2002,2003,2013,2014,2015,2016,2017,2018,2019,2021];

export default class TeamsScreen extends Component {
  static screenHeader = "Football Teams";

  constructor(props) {
    super(props);
    this.state = {
      teams: [],
      team: undefined,
      teamsMap: {}
    };
    this.showTeamModal = this.showTeamModal.bind(this);
  }
    /*
    axios
      .all(requests)
      .then(
        axios.spread((...responses) => {
          if (responses) {
            console.log(responses[0], responses[1]);

            for (let i = 0; i < responses.length; i++) {
              if (responses[i].teams) {
                teams = teams.concat(responses[i].teams);
              }
            }
          }

          that.setState({ teams, competitions });
        })
      )
      .catch((errors) => {
        // react on errors.
        console.error(errors);
      });
      */

  async componentDidMount() {
    var that = this;
    let teams = [];
    let teamsMap = {};
    const requests = AvailableCompetitionsIds.map(getCompetitionTeam);

    Promise.all(requests)
      .then((results) => {
        if (results) {
          results.forEach((result) => {

            if (result){
              teams = teams.concat(result);
  
              result.forEach((team) => {
                teamsMap[team.id] = team;
              });
            }
          that.setState({ teamsMap, teams: Object.values(teamsMap) });
          });
        }
      })
      .catch((error) => {
        // react on errors.
        console.error(error);
        console.log(`getTeams error: ${error}`);
      });
  }


  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.teams !== nextState.teams) return true;
    if (this.state.team !== nextState.team) return true;
    if (this.state.competitions !== nextState.competitions) return true;
    return false;
  }

  showTeamModal = team => {
    this.setState({ team });
  };

  renderTeamDetails = () => (
    <PopupModal
    isVisible={!!this.state.team}
    title={this.state.team.name}
    team={this.state.team}
    buttons={[]}
    buttonsVertical={false}
    height={AppSizes.DEVICE_HEIGHT}
    onClose={() => this.showTeamModal(undefined)}
  />
  );

  renderTeam = ({ item, index }) => {
    return(<TeamCard key={item.id} team={item}  showTeamDetails={this.showTeamModal}/>);
    }

  renderHeader = () => (
    <View style={[styles.headerFrame]}>
      <View style={[styles.titleFrame]}>
        <ScaledText
          text={TeamsScreen.screenHeader}
          style={styles.screenHeader}
        />
      </View>
      <View style={[styles.buttonFrame]}>
        <Button
          title="Reload"
          color={colors.red}
          onPress={() => Updates.reload()}
        />
      </View>
    </View>
  );

  renderTeamsList = () => (
    <FlatList
      keyExtractor={(item) => `${item.id}`}
      data={this.state.teams}
      renderItem={(item) => this.renderTeam(item)}
      ListEmptyComponent={renderEmptyComponent("Loading teams")}
      style={[AppStyles.listContainer]}
      contentContainerStyle={{
        ...AppStyles.top_center_col,
        width: "100%",
        paddingVertical: getRelativeHeight(10),
      }}
      onEndReachedThreshold={0.5}
      initialNumToRender={4}
    />
  );

  // !!this.state.team
  render = () => (
    <View style={[styles.container]}>
    {!!this.state.team && this.renderTeamDetails()}
    {this.renderHeader()}
    {this.renderTeamsList()}
    </View>
  );
}

const styles = StyleSheet.create({
  headerFrame: {
    ...AppStyles.center_align_row, width: "100%", height: AppSizes.headerHeight, backgroundColor: colors.veryLightGrey
  },
  titleFrame: {
    ...AppStyles.center_align_row, width: "50%"
  },
  buttonFrame: {
    ...AppStyles.center_align_row, width: "50%"
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    ...AppStyles.top_center_col,
  },
  screenHeader: {
    ...AppStyles.h1,
    color: colors.red,
    fontWeight: "bold",
  },
  teamText: {
    ...AppFonts.h5,
    color: colors.darkGrey,
    textAlign: "left",
    letterSpacing: 0.07,
  },
});
