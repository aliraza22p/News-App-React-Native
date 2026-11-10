import React, { useContext, useState } from 'react';
import {
    Alert,
    Image,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import themeContext from '../config/themeContext';

function TopNewsCard({ item }) {
    const theme = useContext(themeContext);
    const { width } = useWindowDimensions();
    const [imageFailed, setImageFailed] = useState(false);

    const openArticle = async () => {
        if (!item.url || !/^https?:\/\//i.test(item.url)) {
            Alert.alert('Article unavailable', 'This story does not have a valid article link.');
            return;
        }

        try {
            await Linking.openURL(item.url);
        } catch (error) {
            Alert.alert('Unable to open article', 'Please try again in a moment.');
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel={`Open article: ${item.title || 'Top story'}`}
            onPress={openArticle}
            style={[
                styles.card,
                {
                    width: Math.min(width * 0.78, 360),
                    backgroundColor: theme.cardBackground,
                    borderColor: theme.borderColor
                }
            ]}
        >
            <View style={styles.imageWrap}>
                <Image
                    source={imageFailed || !item.urlToImage
                        ? require('../assets/no-image.png')
                        : { uri: item.urlToImage }}
                    onError={() => setImageFailed(true)}
                    resizeMode="cover"
                    style={styles.image}
                />
                <View style={styles.topLabel}>
                    <Text style={styles.topLabelText}>TOP STORY</Text>
                </View>
            </View>
            <View style={styles.content}>
                <Text style={[styles.source, { color: theme.accentColor }]}>
                    {(item.source && item.source.name) || 'Latest news'}
                </Text>
                <Text style={[styles.title, { color: theme.textColor }]} numberOfLines={3}>
                    {item.title || 'Untitled story'}
                </Text>
                <View style={styles.readMore}>
                    <Text style={[styles.readMoreText, { color: theme.accentColor }]}>Read article</Text>
                    <Ionicons name="arrow-forward" color={theme.accentColor} size={16} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        marginRight: 14,
        borderRadius: 18,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#182033',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 }
    },
    imageWrap: {
        height: 165,
        backgroundColor: '#E8ECF2'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    topLabel: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#D92D45',
        borderRadius: 5,
        paddingHorizontal: 9,
        paddingVertical: 6
    },
    topLabelText: {
        color: '#FFFFFF',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.7
    },
    content: {
        padding: 16
    },
    source: {
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginBottom: 7
    },
    title: {
        fontSize: 16,
        fontWeight: '800',
        lineHeight: 22
    },
    readMore: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 13
    },
    readMoreText: {
        fontSize: 12,
        fontWeight: '700',
        marginRight: 6
    }
});

export default TopNewsCard;
