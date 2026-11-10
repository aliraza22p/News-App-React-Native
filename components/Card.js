import React, { useContext, useState } from 'react';
import {
    Alert,
    Image,
    Linking,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import themeContext from '../config/themeContext';

function Card({ item }) {
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

    const handleShare = async () => {
        if (!item.url) {
            Alert.alert('Unable to share', 'This story does not have an article link.');
            return;
        }

        try {
            await Share.share({
                title: item.title || 'News story',
                message: `${item.title || 'News story'}\n\nRead more: ${item.url}`,
                url: item.url
            });
        } catch (error) {
            Alert.alert('Unable to share', 'Please try again in a moment.');
        }
    };

    const publishedAt = item.publishedAt
        ? new Date(item.publishedAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
        : 'Recently';

    return (
        <View style={[
            styles.card,
            {
                backgroundColor: theme.cardBackground,
                borderColor: theme.borderColor,
                maxWidth: Math.min(width - 32, 900)
            }
        ]}>
            <TouchableOpacity
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel={`Open article: ${item.title || 'News story'}`}
                onPress={openArticle}
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
                    <View style={styles.openBadge}>
                        <Ionicons name="open-outline" color="#FFFFFF" size={16} />
                        <Text style={styles.openBadgeText}>Read story</Text>
                    </View>
                </View>
            </TouchableOpacity>

            <View style={styles.content}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={`Open article: ${item.title || 'News story'}`}
                    onPress={openArticle}
                >
                    <Text style={[styles.source, { color: theme.accentColor }]}>
                        {(item.source && item.source.name) || 'Latest news'}
                    </Text>
                    <Text style={[styles.title, { color: theme.textColor }]} numberOfLines={3}>
                        {item.title || 'Untitled story'}
                    </Text>
                    {!!item.description && (
                        <Text style={[styles.description, { color: theme.secondaryTextColor }]} numberOfLines={3}>
                            {item.description}
                        </Text>
                    )}
                </TouchableOpacity>
                <View style={styles.footer}>
                    <Text style={[styles.meta, { color: theme.secondaryTextColor }]}>
                        {publishedAt}{item.author ? `  ·  ${item.author}` : ''}
                    </Text>
                    <TouchableOpacity
                        accessibilityRole="button"
                        accessibilityLabel="Share this story"
                        onPress={handleShare}
                        style={styles.shareButton}
                    >
                        <Ionicons name="share-social-outline" color={theme.accentColor} size={19} />
                        <Text style={[styles.shareText, { color: theme.accentColor }]}>Share</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: '100%',
        alignSelf: 'center',
        marginBottom: 18,
        borderRadius: 18,
        borderWidth: 1,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#182033',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 5 }
    },
    imageWrap: {
        width: '100%',
        height: 220,
        backgroundColor: '#E8ECF2'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    openBadge: {
        position: 'absolute',
        right: 14,
        bottom: 14,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(20, 27, 40, 0.82)',
        borderRadius: 18,
        paddingHorizontal: 12,
        paddingVertical: 8
    },
    openBadgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 6
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 15
    },
    source: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 1,
        textTransform: 'uppercase',
        marginBottom: 7
    },
    title: {
        fontSize: 20,
        lineHeight: 27,
        fontWeight: '800'
    },
    description: {
        fontSize: 14,
        lineHeight: 21,
        marginTop: 8
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 16
    },
    meta: {
        flex: 1,
        fontSize: 12,
        marginRight: 10
    },
    shareButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingLeft: 8
    },
    shareText: {
        fontSize: 12,
        fontWeight: '700',
        marginLeft: 5
    }
});

export default Card;
