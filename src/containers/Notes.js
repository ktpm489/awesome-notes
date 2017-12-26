import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

import { NotesStyle } from '../styles/index';
import { notes } from '../selectors/notes';
import { goto } from '../actions/navigation';
import { deleteNote, updateNote, filterByFavourites } from '../actions/notes';
import HeaderButton from '../components/common/HeaderButton';
import EmptyNotes from '../components/Notes/EmptyNotes';
import NotesList from '../components/Notes/NotesList';
import NoFavouriteNotes from '../components/Notes/NoFavouriteNotes';

class Notes extends Component {
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        const gotoCreateNote = state.params && state.params.gotoCreateNote ? state.params.gotoCreateNote : null;
        const onFilterByFavourites = state.params && state.params.onFilterByFavourites ? state.params.onFilterByFavourites : null;
        const favouriteIcon = state.params && state.params.favouriteIcon ? state.params.favouriteIcon : 'favourite';
        return {
            title: 'Notes',
            headerRight: <HeaderButton action={gotoCreateNote} type='plus' />,
            headerLeft: <HeaderButton action={onFilterByFavourites} type={favouriteIcon} />
        }
    };

    componentDidMount() {
        const favouriteIcon = this.props.isFilteredByFavourites ? 'favourite-selected' : 'favourite';
        this.props.navigation.setParams({
            gotoCreateNote: this.props.gotoCreateNote,
            onFilterByFavourites: this.props.onFilterByFavourites,
            favouriteIcon
        });
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.isFilteredByFavourites !== this.props.isFilteredByFavourites) {
            const favouriteIcon = nextProps.isFilteredByFavourites ? 'favourite-selected' : 'favourite';
            this.props.navigation.setParams({ favouriteIcon });
        }
    }

    _renderNotes() {
        // render no favourite notes Component
        if(this.props.isFilteredByFavourites && this.props.notes.length === 0) {
            return <NoFavouriteNotes />;
        }
        return this.props.notes.length > 0 ? <NotesList notes={this.props.notes} updateNote={this.props.updateNote} deleteNote={this.props.deleteNote} /> : <EmptyNotes gotoCreateNote={this.props.gotoCreateNote} />;
    }

    render() {
        return (
            <View style={NotesStyle.container}>
                {this._renderNotes()}
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return ({
        notes: notes(state),
        isFilteredByFavourites: state.notes.filterByFavourites
    });
};

const mapDispatchToProps = (dispatch) => {
    return ({
        gotoCreateNote: () => {
            dispatch(goto('CreateNote'));
        },
        updateNote: (note) => {
            dispatch(updateNote(note));
        },
        deleteNote: (id) => {
            dispatch(deleteNote(id));
        },
        onFilterByFavourites: () => {
            dispatch(filterByFavourites());
        }
    });
};

Notes.propTypes = {
    notes: PropTypes.array.isRequired,
    gotoCreateNote: PropTypes.func.isRequired,
    updateNote: PropTypes.func.isRequired,
    deleteNote: PropTypes.func.isRequired,
    onFilterByFavourites: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Notes);