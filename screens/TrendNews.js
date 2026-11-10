import React, { useContext } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';

import TopNewsCard from '../components/TopNewsCard';
import themeContext from '../config/themeContext';

const TrendNews = ({ articles, isLoading }) => {
    const theme = useContext(themeContext);

    if (isLoading) {
        return (
            <View style={styles.state}>
                <ActivityIndicator size="small" color={theme.accentColor} />
                <Text style={[styles.stateText, { color: theme.secondaryTextColor }]}>Loading top stories…</Text>
            </View>
        );
    }

    if (!articles || articles.length === 0) {
        return (
            <View style={[styles.empty, { backgroundColor: theme.cardBackground, borderColor: theme.borderColor }]}>
                <Text style={[styles.stateText, { color: theme.secondaryTextColor }]}>No top stories are available right now.</Text>
            </View>
        );
    }

    return (
        <FlatList
            horizontal
            data={articles}
            keyExtractor={(item, index) => item.url || `top-story-${index}`}
            renderItem={({ item }) => <TopNewsCard item={item} />}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.list}
        />
    );
};

const styles = StyleSheet.create({
    list: {
        paddingBottom: 4
    },
    state: {
        height: 100,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    stateText: {
        fontSize: 13,
        lineHeight: 20,
        textAlign: 'center',
        marginLeft: 8
    },
    empty: {
        minHeight: 82,
        borderWidth: 1,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 18
    }
});

export default TrendNews;
