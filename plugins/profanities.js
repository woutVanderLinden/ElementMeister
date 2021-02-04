'use strict';

const MINUTE = 1000 * 60;
const redis = require('../redis.js');

const analytics = redis.useDatabase('analytics');

// Based on the list of banned phrases on the 3DS.
const PROFANITY_LIST = ["^cokehead$", "^foad$", "^fu©k$", "^soab$", "^analingus$", "^analintruder$", "^anilingus$", "^anus$", "^arsebandit$", "^arsehole$", "^arsewipe$", "^asphyxiophilia$", "^asshole$", "^asswipe$", "^b17ch$", "^b1tch$", "^badword$", "^ballbag$", "^ballsac$", "^bastard$", "^battyboy$", "^battyman$", "^bawbag$", "^beastiality$", "^beefcurtains$", "^bellend$", "^bi7ch$", "^bitch$", "^blowjob$", "^bltch$", "^boabie$", "^bollocks$", "^bollox$", "^boner$", "^boobjob$", "^boobies$", "^boobs$", "^buftie$", "^buggery$", "^bukkake$", "^bullshit$", "^bumbandit$", "^bumchum$", "^buttfucker$", "^buttplug$", "^c0k$", "^cack$", "^camelcunt$", "^cameltoe$", "^cannabis$", "^capper$", "^carpetmuncher$", "^chebs$", "^chickswithdicks$", "^chink$", "^choad$", "^clit$", "^clunge$", "^clusterfuck$", "^cocksucker$", "^cock$", "^cockend$", "^cockgoblin$", "^cockmuncher$", "^cocknose$", "^cok$", "^coon$", "^crackhead$", "^crackwhore$", "^crap$", "^creampie$", "^cretin$", "^cumshot$", "^cumstain$", "^cunilingus$", "^cunnilingus$", "^cuntflaps$", "^cunt$", "^cybersex$", "^dago$", "^darkie$", "^diaf$", "^dickcheese$", "^dickhead$", "^dicknose$", "^dike$", "^dildo$", "^dipshit$", "^doggiestyle$", "^doggystyle$", "^doublepenetration$", "^douchebag$", "^douchefag$", "^dunecoon$", "^dyke$", "^ejaculate$", "^fadge$", "^fag$", "^faggot$", "^fandan$", "^fap$", "^fascist$", "^fcuk$", "^feck$", "^felatio$", "^felch$", "^fellate$", "^fellatio$", "^feltch$", "^feltching$", "^fenian$", "^fingerbang$", "^fingerfuck$", "^fisting$", "^fluffer$", "^fook$", "^foreskin$", "^fucc$", "^fuccd$", "^fucced$", "^fuccer$", "^fucces$", "^fuccing$", "^fuccs$", "^fuckface$", "^fuck$", "^fucker$", "^fucking$", "^fucktard$", "^fuckwit$", "^fuct$", "^fudgepacker$", "^fugly$", "^fuk$", "^funbags$", "^fvck$", "^gangbang$", "^gangrape$", "^ganja$", "^gaylord$", "^gaytard$", "^gimp$", "^gizzum$", "^gloryhole$", "^goatse$", "^gobshite$", "^goddamn$", "^goddammit$", "^gollywog$", "^gonads$", "^gooch$", "^gook$", "^goolies$", "^gypo$", "^gyppo$", "^handjob$", "^hard-on$", "^hardon$", "^hentai$", "^hooker$", "^hoormister$", "^incest$", "^intercourse$", "^jackingoff$", "^jackoff$", "^jamrag$", "^jap'seye$", "^japseye$", "^jaysis$", "^jaysus$", "^jerkoff$", "^jerkingoff$", "^jiggaboo$", "^jism$", "^jiz$", "^jizm$", "^jizz$", "^kaffir$", "^keech$", "^klunge$", "^knackers$", "^knobend$", "^knobhead$", "^knobjockey$", "^koon$", "^kyke$", "^lardarse$", "^lardass$", "^lesbo$", "^lezbo$", "^lezzer$", "^lezzie$", "^masterbate$", "^masterbation$", "^masturbat$", "^masturbate$", "^masturbating$", "^masturbation$", "^meatspin$", "^milf$", "^minger$", "^mofo$", "^molest$", "^mong$", "^mongoloid$", "^motherfucker$", "^mowdie$", "^mutha$", "^nig-nog$", "^nig$", "^niga$", "^nigga$", "^nigger$", "^nignog$", "^nob$", "^nobhead$", "^nonce$", "^numpty$", "^nutsack$", "^omfg$", "^oralsex$", "^orgasm$", "^orgy$", "^p0rn$", "^paedo$", "^paedofile$", "^paedophile$", "^pecker$", "^pederast$", "^pedofile$", "^pedophile$", "^penis$", "^phuk$", "^pikey$", "^pimp$", "^pissflaps$", "^pisshead$", "^piss$", "^ponce$", "^poofter$", "^poon$", "^poonanie$", "^poontang$", "^porn$", "^pr0n$", "^pron$", "^pubes$", "^punani$", "^pussy$", "^queef$", "^queer$", "^raghead$", "^raping$", "^rapist$", "^rentboy$", "^retarded$", "^rimjob$", "^rimming$", "^ringpiece$", "^rugmuncher$", "^s1ut$", "^s1utd$", "^sandnigger$", "^schlong$", "^scrote$", "^scrotum$", "^sex$", "^shag$", "^shagged$", "^sheepshagger$", "^shirtlifter$", "^shithead$", "^shit$", "^shitcunt$", "^shite$", "^skank$", "^slapper$", "^slut$", "^smeg$", "^smegma$", "^snatch$", "^sodding$", "^sodomise$", "^sodomy$", "^sonofabitch$", "^son-of-a-bitch$", "^spaccer$", "^spack$", "^spastic$", "^spaz$", "^sperm$", "^spic$", "^splooge$", "^spunk$", "^stfu$", "^stiffy$", "^strap-on$", "^strapon$", "^subnormal$", "^taig$", "^teabagged$", "^teabagging$", "^testicle$", "^titwank$", "^titties$", "^titty$", "^tosspot$", "^tosser$", "^towelhead$", "^trannie$", "^tranny$", "^tubgirl$", "^tugjob$", "^turdburglar$", "^turd$", "^twat$", "^vadge$", "^vag$", "^vaj$", "^wankshaft$", "^wankstain$", "^wank$", "^wanker$", "^whore$", "^windowlicker$", "^wog$", "^wtf$", "^yid$", "^zoophilia$", "^badwordj$", "^bbwjja$", ".*asshole.*", ".*blowjob.*", ".*cocksuck.*", ".*cunt.*", ".*fag.*", ".*fuck.*", ".*nigga.*", ".*nigger.*", ".*pussy.*", ".*shit.*", ".*slut.*", ".*twat.*", "^poopyhead.*", "^meanie.*", "^stupidface.*", "^dumbdumb.*"].map(pattern => new RegExp(pattern));

let counts = {};
let totals = {};

module.exports = {
	async init() {
		setInterval(async () => {
			let oldcounts = counts;
			let oldtotals = totals;
			counts = {};
			totals = {};

			for (let room in oldcounts) {
				analytics.hincrby(`profanities:${room}`, 'count', oldcounts[room]);
			}

			for (let room in oldtotals) {
				analytics.hincrby(`profanities:${room}`, 'total', oldtotals[room]);
			}
		}, 5 * MINUTE);
	},
	analyzer: {
		async parser(message) {
			// Don't even bother with messages that are just emoticons.
			if (toId(message).length < 2) return false;

			let words = message.split(' ').map(token => toId(token));

			let profanities = words.reduce((tally, word) => {
				return tally + PROFANITY_LIST.filter(val => val.test(word)).length;
			}, 0);

			if (!(this.room in counts)) counts[this.room] = 0;
			counts[this.room] += profanities;

			if (!(this.room in totals)) totals[this.room] = 0;
			totals[this.room] += words.length;
		},

		async display(room) {
			let profanities = await this.data.hgetall(`profanities:${room}`);
			return '<p>Percentage of words said that are swear words: ' + (profanities.count ? (profanities.count / profanities.total * 100).toFixed(3) : 0) + '</p>';
		},
	},
};
