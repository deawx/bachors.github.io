/******************************************************
* #### jQuery-Youtube-Channels-Playlist v05 ####
* Coded by Ican Bachors 2014.
* http://ibacor.com/labs/jquery-youtube-channels-playlist/
* Updates will be posted to this site.
******************************************************/

$.fn.ycp = function(opt) {
	
	var defaultopt = {
        playlist : 10,
		autoplay : false,
		related : false
    };
	opt.playlist = (opt.playlist == undefined ? defaultopt.playlist : opt.playlist);
	opt.autoplay = (opt.autoplay == undefined ? defaultopt.autoplay : opt.autoplay);
	opt.related = (opt.related == undefined ? defaultopt.related : opt.related);

    $(this).each(function(i, a) {
		var b = ($(this).attr('id') != null && $(this).attr('id') != undefined ? '#' + $(this).attr('id') : '.' + $(this).attr('class')),
			channel = $(this).data('ycp'),
			html = '<div class="ycp">' + '<div class="unit kenca">' + '<div class="ycp_vid_play" title="Play video"></div>' + '</div>' + '<div class = "unit katuhu">' + '<div id="ycp_youtube_channels' + i + '"></div>' + '</div>' + '</div>';
			$(this).html(html);
		if(channel.substring(0, 2) == 'PL' || channel.substring(0, 2) == 'UU'){
			var pageToken = '';
			ycp_list(channel, pageToken, i, b);
		}else{
			var tipe = (channel.substring(0, 2) == 'UC' ? 'id' : 'forUsername');
			ycp_play(channel, tipe, i, b);
		}
    });

    function ycp_play(c, d, e, f) {
        $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/channels?part=contentDetails&' + d + '=' + c + '&key=' + opt.apikey,
            crossDomain: true,
            dataType: 'json'
        }).done(function(a) {
            var b = a.items[0].contentDetails.relatedPlaylists.uploads,
                pageToken = '';
            ycp_list(b, pageToken, e, f)
        })
    }

    function ycp_list(f, g, k, l) {
        $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=' + opt.playlist + '&playlistId=' + f + '&key=' + opt.apikey + '&pageToken=' + g,
            dataType: 'json'
        }).done(function(c) {
            var d = '';
            d += '<div class="vid-top">';
            d += '<span class="tombol vid-prev" title="Previous videos">Previous</span> ';
            d += '<span class="tombol vid-next" title="Next videos">Next</span><span class="about" title="ycp.js"><a href="http://ibacor.com/labs/jquery-youtube-channels-playlist" target="_BLANK">?</a></span></div><div class="vid-bottom">';
            $.each(c.items, function(i, a) {
                var b = c.items[i].snippet.resourceId.videoId;
                ycp_part(b, i, k, l);
                d += '<div class="play" data-vvv="' + b + '" data-img="' + c.items[i].snippet.thumbnails.high.url + '" title="' + c.items[i].snippet.title + '"><div class="thumb"><img src="' + c.items[i].snippet.thumbnails.default.url + '" alt=" "><span class="tm' + i + '"></span></div>';
                d += '<div class="title">' + c.items[i].snippet.title + '</div><span class="mute by' + i + '"></span><br><span class="mute views' + i + '"></span> <span class="mute">-</span> <span class="mute date' + i + '"></span></div>'
            });
            d += '</div>';
            $(l + ' .ycp div#ycp_youtube_channels' + k).html(d);
            if (c.prevPageToken == null || c.prevPageToken == undefined) {
                var e = $(l + ' .ycp div#ycp_youtube_channels' + k + ' div.play').attr("data-vvv"),
					imag = $(l + ' .ycp div#ycp_youtube_channels' + k + ' div.play').attr("data-img");
				if(opt.autoplay == false){
					$(l + ' .ycp div.ycp_vid_play:eq(' + k + ')').html('<img src=" ' + imag + '">');
                }else{
					var hu = '<object type="application/x-shockwave-flash" data="//www.youtube.com/v/' + e + '?rel=' + (opt.related == true ? 1 : 0) + '&amp;autoplay=1" class="vid-iframe">'
							+'	<param name="movie" value="//www.youtube.com/v/' + e + '?rel=' + (opt.related == true ? 1 : 0) + '&amp;autoplay=1" />'
							+'	<param name="allowFullScreen" value="true" />'
							+'	<param name="allowscriptaccess" value="always" />'
							+'</object>';
					$(l + ' .ycp div.ycp_vid_play:eq(' + k + ')').html(hu);
                }
				$(l + ' .ycp div#ycp_youtube_channels' + k + ' div').removeClass('vid-active');
                $(l + ' .ycp div#ycp_youtube_channels' + k + ' div.play:eq(0)').addClass('vid-active')
            } else {
                $(l + ' .ycp div#ycp_youtube_channels' + k + ' span.vid-prev').click(function() {
                    g = c.prevPageToken;
                    ycp_list(f, g, k, l);
                    return false
                })
            }
            $(l + ' .ycp div#ycp_youtube_channels' + k + ' span.vid-next').click(function() {
                g = c.nextPageToken;
                ycp_list(f, g, k, l);
                return false
            });
            $(l + ' .ycp div#ycp_youtube_channels' + k + ' div.play').each(function() {
                $(this).click(function() {
                    var a = $(this).attr("data-vvv"),
						m = $(this).attr("data-img");
                    $(l + ' .ycp div#ycp_youtube_channels' + k + ' div').removeClass('vid-active');
                    $(this).addClass('vid-active');
					if(opt.autoplay == false){
						$(l + ' .ycp div.ycp_vid_play:eq(' + k + ')').html('<img src=" ' + m + '">');
					}else{
						var huy = '<object type="application/x-shockwave-flash" data="//www.youtube.com/v/' + a + '?rel=' + (opt.related == true ? 1 : 0) + '&amp;autoplay=1" class="vid-iframe">'
								+'	<param name="movie" value="//www.youtube.com/v/' + a + '?rel=' + (opt.related == true ? 1 : 0) + '&amp;autoplay=1" />'
								+'	<param name="allowFullScreen" value="true" />'
								+'	<param name="allowscriptaccess" value="always" />'
								+'</object>';
						$(l + ' .ycp div.ycp_vid_play:eq(' + k + ')').html(huy);
					}
					return false
                })
            });
			$(l + ' .ycp div.ycp_vid_play:eq(' + k + ')').click(function() {
                var a = $(l + ' .ycp div#ycp_youtube_channels' + k + ' div.play.vid-active').attr("data-vvv");
				var hux = '<object type="application/x-shockwave-flash" data="//www.youtube.com/v/' + a + '?rel=' + (opt.related == true ? 1 : 0) + '&amp;autoplay=1" class="vid-iframe">'
						+'	<param name="movie" value="//www.youtube.com/v/' + a + '?rel=' + (opt.related == true ? 1 : 0) + '&amp;autoplay=1" />'
						+'	<param name="allowFullScreen" value="true" />'
						+'	<param name="allowscriptaccess" value="always" />'
						+'</object>';
				$(this).html(hux);
				return false
			});
        })
    }

    function ycp_part(c, i, d, e) {
        $.ajax({
            url: 'https://www.googleapis.com/youtube/v3/videos?id=' + c + '&key=' + opt.apikey + '&part=contentDetails,snippet,statistics',
            dataType: 'json'
        }).done(function(a) {
            var b = a.items[0].contentDetails.duration,
                dataw = '',
                menit = '',
                detik = '';
            if (b.match(/M/g)) {
                dataw = b.split('M');
                menit = dataw[0].replace('PT', '');
                if (dataw[1] != '') {
                    detik = dataw[1].replace('S', '')
                } else {
                    detik = '00'
                }
            } else {
                dataw = b.split('PT');
                menit = '00';
                detik = dataw[1].replace('S', '')
            }
            $(e + ' .ycp div#ycp_youtube_channels' + d + ' span.tm' + i).html(menit + ':' + detik);
            $(e + ' .ycp div#ycp_youtube_channels' + d + ' span.by' + i).html('by ' + a.items[0].snippet.channelTitle);
            $(e + ' .ycp div#ycp_youtube_channels' + d + ' span.views' + i).html(addCommas(a.items[0].statistics.viewCount) + ' views');
			$(e + ' .ycp div#ycp_youtube_channels' + d + ' span.date' + i).html(_timeSince(new Date(a.items[0].snippet.publishedAt).getTime()))
        })
    }

    function _timeSince(a) {
        var s = Math.floor((new Date() - a) / 1000),
            i = Math.floor(s / 31536000);
        if (i > 1) {
            return i + " years ago"
        }
        i = Math.floor(s / 2592000);
        if (i > 1) {
            return i + " months ago"
        }
        i = Math.floor(s / 86400);
        if (i > 1) {
            return i + " days ago"
        }
        i = Math.floor(s / 3600);
        if (i > 1) {
            return i + " hours ago"
        }
        i = Math.floor(s / 60);
        if (i > 1) {
            return i + " minutes ago"
        }
        return Math.floor(s) + " seconds ago"
    }
	
	function addCommas(a) {
        a += '';
        x = a.split('.');
        x1 = x[0];
        x2 = x.length > 1 ? '.' + x[1] : '';
        var b = /(\d+)(\d{3})/;
        while (b.test(x1)) {
            x1 = x1.replace(b, '$1' + ',' + '$2')
        }
        return x1 + x2
    }

}
