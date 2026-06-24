import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tv, Star, Clock, TrendingUp, Bookmark, BookmarkCheck } from 'lucide-react';

// ── Static channel data ──
const CHANNELS = [
  { id: 'sun-tv', name: 'SUN TV', lang: 'Tamil', color: '#FF6600', slots: ['1:30 PM', '6:30 PM', '9:00 PM'] },
  { id: 'ktv', name: 'KTV', lang: 'Tamil', color: '#E50914', slots: ['All Day'] },
  { id: 'vijay-tv', name: 'VIJAY TV', lang: 'Tamil', color: '#1E90FF', slots: ['2:00 PM', '9:30 PM'] },
  { id: 'zee-tamil', name: 'ZEE TAMIL', lang: 'Tamil', color: '#6C2DC7', slots: ['3:00 PM', '8:30 PM'] },
  { id: 'colors-tamil', name: 'COLORS TAMIL', lang: 'Tamil', color: '#E91E63', slots: ['2:30 PM', '9:00 PM'] },
  { id: 'gemini-tv', name: 'GEMINI TV', lang: 'Telugu', color: '#FF6B35', slots: ['1:00 PM', '6:00 PM', '9:00 PM'] },
  { id: 'zee-telugu', name: 'ZEE TELUGU', lang: 'Telugu', color: '#7B2FBE', slots: ['2:00 PM', '8:30 PM'] },
  { id: 'etv-telugu', name: 'ETV TELUGU', lang: 'Telugu', color: '#21D07A', slots: ['3:00 PM', '9:00 PM'] },
  { id: 'star-maa', name: 'STAR MAA', lang: 'Telugu', color: '#F5C518', slots: ['1:30 PM', '9:30 PM'] },
  { id: 'asianet', name: 'ASIANET', lang: 'Malayalam', color: '#E84B4B', slots: ['1:30 PM', '6:00 PM', '9:00 PM'] },
  { id: 'surya-tv', name: 'SURYA TV', lang: 'Malayalam', color: '#FF8C00', slots: ['2:00 PM', '8:30 PM'] },
  { id: 'mazhavil', name: 'MAZHAVIL MANORAMA', lang: 'Malayalam', color: '#00BCD4', slots: ['3:00 PM', '9:00 PM'] },
  { id: 'udaya-tv', name: 'UDAYA TV', lang: 'Kannada', color: '#F7DC6F', slots: ['1:00 PM', '8:00 PM'] },
  { id: 'zee-kannada', name: 'ZEE KANNADA', lang: 'Kannada', color: '#9C27B0', slots: ['2:30 PM', '9:00 PM'] },
  { id: 'star-suvarna', name: 'STAR SUVARNA', lang: 'Kannada', color: '#FF6B35', slots: ['1:30 PM', '8:30 PM'] },
];

// ── TV Classics (frequently aired movies) ──
type TVClassic = {
  id: number;
  title: string;
  lang: string;
  year: number;
  imdb: number;
  channels: string[];
  frequency: string;
  poster: string;
  airCount: string;
};

const TV_CLASSICS: TVClassic[] = [
  { id: 5765, title: 'Baasha', lang: 'Tamil', year: 1995, imdb: 7.8, channels: ['SUN TV', 'KTV'], frequency: 'Weekly', poster: '', airCount: '200+' },
  { id: 26594, title: 'Padayappa', lang: 'Tamil', year: 1999, imdb: 7.5, channels: ['KTV'], frequency: 'Monthly', poster: '', airCount: '150+' },
  { id: 100789, title: 'Sivaji: The Boss', lang: 'Tamil', year: 2007, imdb: 7.4, channels: ['VIJAY TV'], frequency: 'Weekly', poster: '', airCount: '120+' },
  { id: 39150, title: 'Enthiran', lang: 'Tamil', year: 2010, imdb: 7.5, channels: ['SUN TV', 'KTV'], frequency: 'Bi-weekly', poster: '', airCount: '100+' },
  { id: 554600, title: 'Mersal', lang: 'Tamil', year: 2017, imdb: 7.4, channels: ['VIJAY TV', 'SUN TV'], frequency: 'Weekly', poster: '', airCount: '80+' },
  { id: 551276, title: 'Bigil', lang: 'Tamil', year: 2019, imdb: 7.3, channels: ['VIJAY TV'], frequency: 'Weekly', poster: '', airCount: '70+' },
  { id: 723996, title: 'Master', lang: 'Tamil', year: 2021, imdb: 7.7, channels: ['SUN TV'], frequency: 'Weekly', poster: '', airCount: '60+' },
  { id: 776503, title: 'Vikram', lang: 'Tamil', year: 2022, imdb: 7.9, channels: ['SUN TV', 'KTV'], frequency: 'Weekly', poster: '', airCount: '50+' },
  { id: 100042, title: 'Thuppakki', lang: 'Tamil', year: 2012, imdb: 7.8, channels: ['KTV'], frequency: 'Weekly', poster: '', airCount: '150+' },
  { id: 263449, title: 'Kaththi', lang: 'Tamil', year: 2014, imdb: 7.7, channels: ['SUN TV'], frequency: 'Weekly', poster: '', airCount: '80+' },
  { id: 187596, title: 'Mankatha', lang: 'Tamil', year: 2011, imdb: 7.5, channels: ['KTV'], frequency: 'Monthly', poster: '', airCount: '80+' },
  { id: 340215, title: 'Petta', lang: 'Tamil', year: 2019, imdb: 7.4, channels: ['SUN TV'], frequency: 'Monthly', poster: '', airCount: '40+' },
  { id: 76341, title: 'Nayakan', lang: 'Tamil', year: 1987, imdb: 8.1, channels: ['SUN TV', 'KTV'], frequency: 'Monthly', poster: '', airCount: '200+' },
  { id: 297799, title: 'Vinnaithaandi Varuvaayaa', lang: 'Tamil', year: 2010, imdb: 7.9, channels: ['SUN TV'], frequency: 'Monthly', poster: '', airCount: '100+' },
  { id: 166176, title: 'Alaipayuthey', lang: 'Tamil', year: 2000, imdb: 8.0, channels: ['SUN TV', 'KTV'], frequency: 'Monthly', poster: '', airCount: '150+' },
  // Telugu
  { id: 76177, title: 'Magadheera', lang: 'Telugu', year: 2009, imdb: 7.8, channels: ['GEMINI TV', 'ZEE TELUGU'], frequency: 'Weekly', poster: '', airCount: '150+' },
  { id: 302325, title: 'Baahubali: The Beginning', lang: 'Telugu', year: 2015, imdb: 8.0, channels: ['GEMINI TV', 'STAR MAA'], frequency: 'Weekly', poster: '', airCount: '100+' },
  { id: 385687, title: 'Baahubali 2: The Conclusion', lang: 'Telugu', year: 2017, imdb: 8.2, channels: ['GEMINI TV', 'ZEE TELUGU', 'STAR MAA'], frequency: 'Weekly', poster: '', airCount: '120+' },
  { id: 484802, title: 'Pushpa: The Rise', lang: 'Telugu', year: 2021, imdb: 7.6, channels: ['GEMINI TV', 'ZEE TELUGU'], frequency: 'Weekly', poster: '', airCount: '60+' },
  { id: 579974, title: 'RRR', lang: 'Telugu', year: 2022, imdb: 7.8, channels: ['GEMINI TV', 'ETV TELUGU'], frequency: 'Weekly', poster: '', airCount: '50+' },
  { id: 214756, title: 'Bommarillu', lang: 'Telugu', year: 2006, imdb: 7.8, channels: ['GEMINI TV'], frequency: 'Monthly', poster: '', airCount: '100+' },
  // Malayalam
  { id: 193610, title: 'Drishyam', lang: 'Malayalam', year: 2013, imdb: 8.3, channels: ['ASIANET', 'MAZHAVIL MANORAMA'], frequency: 'Monthly', poster: '', airCount: '80+' },
  { id: 335984, title: 'Premam', lang: 'Malayalam', year: 2015, imdb: 8.3, channels: ['ASIANET', 'SURYA TV'], frequency: 'Monthly', poster: '', airCount: '80+' },
  { id: 385717, title: 'Bangalore Days', lang: 'Malayalam', year: 2014, imdb: 8.4, channels: ['ASIANET', 'SURYA TV'], frequency: 'Monthly', poster: '', airCount: '60+' },
];

// ── Weekly schedule data (curated static) ──
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const WEEKLY_PICKS: Record<string, { title: string; time: string }[]> = {
  'sun-tv': [
    { title: 'Vikram', time: '9:00 PM' },
    { title: 'Master', time: '6:30 PM' },
    { title: 'Nayakan', time: '1:30 PM' },
    { title: 'Doctor', time: '9:00 PM' },
    { title: 'Baasha', time: '6:30 PM' },
    { title: 'Soorarai Pottru', time: '9:00 PM' },
    { title: 'Thuppakki', time: '1:30 PM' },
  ],
  'ktv': [
    { title: 'Thuppakki', time: 'All Day' },
    { title: 'Mankatha', time: 'All Day' },
    { title: 'Enthiran', time: 'All Day' },
    { title: 'Padayappa', time: 'All Day' },
    { title: 'Maari', time: 'All Day' },
    { title: 'VIP', time: 'All Day' },
    { title: 'Baasha', time: 'All Day' },
  ],
  'vijay-tv': [
    { title: 'Bigil', time: '9:30 PM' },
    { title: 'Mersal', time: '9:30 PM' },
    { title: 'Master', time: '2:00 PM' },
    { title: 'Sivaji: The Boss', time: '2:00 PM' },
    { title: 'Sarkar', time: '9:30 PM' },
    { title: 'Bigil', time: '2:00 PM' },
    { title: 'Mersal', time: '9:30 PM' },
  ],
  'gemini-tv': [
    { title: 'Magadheera', time: '9:00 PM' },
    { title: 'RRR', time: '6:00 PM' },
    { title: 'Baahubali 2', time: '9:00 PM' },
    { title: 'Pushpa', time: '1:00 PM' },
    { title: 'Baahubali: The Beginning', time: '9:00 PM' },
    { title: 'Magadheera', time: '6:00 PM' },
    { title: 'RRR', time: '9:00 PM' },
  ],
  'asianet': [
    { title: 'Drishyam', time: '9:00 PM' },
    { title: 'Premam', time: '6:00 PM' },
    { title: 'Bangalore Days', time: '9:00 PM' },
    { title: 'Kumbalangi Nights', time: '1:30 PM' },
    { title: 'Minnal Murali', time: '9:00 PM' },
    { title: 'Drishyam 2', time: '6:00 PM' },
    { title: 'Premam', time: '9:00 PM' },
  ],
};

const LANG_COLORS_TV: Record<string, string> = {
  'Tamil': '#FF6B35',
  'Telugu': '#4ECDC4',
  'Malayalam': '#21D07A',
  'Kannada': '#F7DC6F',
};

type TVTab = 'classics' | 'schedule' | 'channels';

export default function TVSchedulePage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<TVTab>('classics');
  const [langFilter, setLangFilter] = useState('all');
  const [selectedChannel, setSelectedChannel] = useState('sun-tv');
  const [tvWatchlist, setTVWatchlist] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem('moviera_tv_watchlist') || '[]'); } catch { return []; }
  });

  const toggleTVWatchlist = (id: number) => {
    setTVWatchlist(prev => {
      const next = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id];
      localStorage.setItem('moviera_tv_watchlist', JSON.stringify(next));
      return next;
    });
  };

  const filteredClassics = langFilter === 'all'
    ? TV_CLASSICS
    : TV_CLASSICS.filter(m => m.lang === langFilter);

  const channelObj = CHANNELS.find(c => c.id === selectedChannel);
  const weeklyForChannel = WEEKLY_PICKS[selectedChannel];

  const LANG_TABS = ['all', 'Tamil', 'Telugu', 'Malayalam', 'Kannada'];

  return (
    <div className="min-h-screen pt-4 md:pt-6 pb-24 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Tv size={28} style={{ color: 'var(--tv-purple)' }} />
          <div>
            <h1 className="font-display text-3xl md:text-4xl" style={{ color: 'var(--tv-purple)' }}>
              TV Schedule
            </h1>
            <p className="text-xs font-condensed" style={{ color: 'var(--text3)', letterSpacing: '0.08em' }}>
              SOUTH INDIAN MOVIES ON TV — CHANNELS &amp; CLASSICS
            </p>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
          {[
            { id: 'classics', label: 'TV Classics', icon: TrendingUp },
            { id: 'schedule', label: 'Weekly Schedule', icon: Clock },
            { id: 'channels', label: 'Channels', icon: Tv },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as TVTab)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-condensed font-bold transition-all"
              style={{
                background: tab === t.id ? 'var(--tv-purple)' : 'transparent',
                color: tab === t.id ? '#fff' : 'var(--text3)',
                letterSpacing: '0.04em',
              }}
            >
              <t.icon size={14} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── TV CLASSICS tab ── */}
        {tab === 'classics' && (
          <>
            {/* Language filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {LANG_TABS.map(lang => {
                const color = lang === 'all' ? 'var(--tv-purple)' : LANG_COLORS_TV[lang];
                return (
                  <button
                    key={lang}
                    onClick={() => setLangFilter(lang)}
                    className="px-3 py-1.5 rounded-full text-xs font-condensed font-bold transition-all"
                    style={{
                      background: langFilter === lang ? `${color}20` : 'var(--card2)',
                      color: langFilter === lang ? color : 'var(--text3)',
                      border: langFilter === lang ? `1px solid ${color}40` : '1px solid var(--border)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {lang === 'all' ? 'ALL LANGUAGES' : lang.toUpperCase()}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3">
              {filteredClassics.map(m => {
                const inList = tvWatchlist.includes(m.id);
                const langColor = LANG_COLORS_TV[m.lang] || '#666';
                return (
                  <div key={m.id} className="card p-4 flex items-center gap-4 hover:border-[var(--tv-purple)] transition-colors fade-in"
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-display text-xl" style={{ color: 'var(--text)', letterSpacing: '0.04em' }}>
                          {m.title}
                        </span>
                        <span className="font-condensed text-xs font-bold px-2 py-0.5 rounded"
                          style={{ background: langColor, color: m.lang === 'Tamil' ? '#fff' : '#000', letterSpacing: '0.06em' }}>
                          {m.lang.toUpperCase()}
                        </span>
                        {m.airCount && (
                          <span className="flex items-center gap-1 text-xs font-condensed font-bold px-2 py-0.5 rounded"
                            style={{ background: 'rgba(168,85,247,0.15)', color: 'var(--tv-purple)', border: '1px solid rgba(168,85,247,0.3)', letterSpacing: '0.06em' }}>
                            <Tv size={10} /> 📺 {m.airCount} AIRINGS
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-mono text-xs" style={{ color: 'var(--text3)' }}>{m.year}</span>
                        <span className="flex items-center gap-1 font-mono text-xs font-bold"
                          style={{ color: '#F5C518' }}>
                          <Star size={10} fill="#F5C518" stroke="none" /> {m.imdb.toFixed(1)} IMDb
                        </span>
                        <span className="font-condensed text-xs font-bold" style={{ color: 'var(--tv-purple)' }}>
                          {m.frequency}
                        </span>
                        <div className="flex gap-1 flex-wrap">
                          {m.channels.map(ch => (
                            <span key={ch} className="font-condensed text-xs px-1.5 py-0.5 rounded"
                              style={{ background: 'var(--card2)', color: 'var(--text3)', border: '1px solid var(--border)', letterSpacing: '0.04em' }}>
                              {ch}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* TV Watchlist button */}
                    <button
                      onClick={e => { e.stopPropagation(); toggleTVWatchlist(m.id); }}
                      className="flex-shrink-0 p-2 rounded-lg transition-all"
                      style={{
                        background: inList ? 'rgba(168,85,247,0.15)' : 'var(--card2)',
                        border: `1px solid ${inList ? 'rgba(168,85,247,0.4)' : 'var(--border)'}`,
                        color: inList ? 'var(--tv-purple)' : 'var(--text3)',
                      }}
                      title={inList ? 'Remove from TV Watchlist' : 'Add to TV Watchlist'}
                    >
                      {inList ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                    </button>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* ── WEEKLY SCHEDULE tab ── */}
        {tab === 'schedule' && (
          <>
            {/* Channel selector */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {CHANNELS.filter(c => WEEKLY_PICKS[c.id]).map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-condensed font-bold transition-all"
                  style={{
                    background: selectedChannel === ch.id ? ch.color : 'var(--card2)',
                    color: selectedChannel === ch.id ? '#fff' : 'var(--text3)',
                    border: `1px solid ${selectedChannel === ch.id ? ch.color : 'var(--border)'}`,
                    letterSpacing: '0.06em',
                  }}
                >
                  {ch.name}
                </button>
              ))}
            </div>

            {channelObj && (
              <div className="card p-4 mb-6" style={{ borderColor: channelObj.color + '40' }}>
                <div className="flex items-center gap-2 mb-1">
                  <Tv size={16} style={{ color: channelObj.color }} />
                  <span className="font-display text-2xl" style={{ color: channelObj.color }}>
                    {channelObj.name}
                  </span>
                  <span className="font-condensed text-xs font-bold px-2 py-0.5 rounded"
                    style={{ background: LANG_COLORS_TV[channelObj.lang] || '#666', color: '#000', letterSpacing: '0.06em' }}>
                    {channelObj.lang.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs font-condensed" style={{ color: 'var(--text3)', letterSpacing: '0.06em' }}>
                  MOVIE SLOTS: {channelObj.slots.join(' · ')}
                </p>
              </div>
            )}

            {weeklyForChannel ? (
              <div className="overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '560px' }}>
                  <thead>
                    <tr>
                      {DAYS.map(day => (
                        <th key={day} className="font-condensed font-bold text-center py-2 px-3"
                          style={{ color: 'var(--gold)', fontSize: '12px', letterSpacing: '0.12em', background: 'var(--card2)', borderBottom: '1px solid var(--border)' }}>
                          {day.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {weeklyForChannel.map((entry, i) => (
                        <td key={i} className="text-center p-3"
                          style={{ background: i % 2 === 0 ? 'var(--card)' : 'var(--surface)', border: '1px solid var(--border)', verticalAlign: 'top' }}>
                          <p className="text-xs font-semibold leading-tight mb-1" style={{ color: 'var(--text)', fontFamily: "'Barlow', sans-serif" }}>
                            {entry.title}
                          </p>
                          <p className="font-mono text-xs" style={{ color: 'var(--text3)' }}>
                            {entry.time}
                          </p>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <p className="text-xs font-condensed mt-3" style={{ color: 'var(--text3)', letterSpacing: '0.06em' }}>
                  * SCHEDULE IS APPROXIMATE — ACTUAL AIRINGS MAY VARY
                </p>
              </div>
            ) : (
              <div className="text-center py-12">
                <Tv size={40} className="mx-auto mb-3" style={{ color: 'var(--text3)' }} />
                <p style={{ color: 'var(--text3)' }}>Schedule not available for this channel</p>
              </div>
            )}
          </>
        )}

        {/* ── CHANNELS tab ── */}
        {tab === 'channels' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {CHANNELS.map(ch => {
              const langColor = LANG_COLORS_TV[ch.lang] || '#666';
              return (
                <div key={ch.id} className="card p-5 hover:border-opacity-60 transition-all"
                  style={{ borderColor: ch.color + '30' }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ background: ch.color + '20', border: `1px solid ${ch.color}40` }}>
                      <Tv size={22} style={{ color: ch.color }} />
                    </div>
                    <span className="font-condensed text-xs font-bold px-2 py-1 rounded"
                      style={{ background: langColor, color: ch.lang === 'Tamil' ? '#fff' : '#000', letterSpacing: '0.06em' }}>
                      {ch.lang.toUpperCase()}
                    </span>
                  </div>
                  <h3 className="font-display text-xl mb-1" style={{ color: ch.color }}>
                    {ch.name}
                  </h3>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {ch.slots.map(slot => (
                      <span key={slot} className="font-mono text-xs px-2 py-0.5 rounded"
                        style={{ background: 'var(--card2)', color: 'var(--text3)', border: '1px solid var(--border)' }}>
                        {slot}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs mt-3 font-condensed" style={{ color: 'var(--text3)', letterSpacing: '0.04em' }}>
                    Daily movie slots — South Indian cinema
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
