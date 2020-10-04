import cron from 'node-cron'
import add from 'date-fns/add'
import isBefore from 'date-fns/isBefore'
import { sendNotification } from './modules/reminder'
import { getBushes } from './dbController'

/*X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X
|                           ,,'``````````````',,                            |
X                        ,'`                   `',                          X
|                      ,'                         ',                        |
X                    ,'          ;       ;          ',                      X
|       (           ;             ;     ;             ;     (               |
X        )         ;              ;     ;              ;     )              X
|       (         ;                ;   ;                ;   (               |
X        )    ;   ;    ,,'```',,,   ; ;   ,,,'```',,    ;   ;               X
|       (    ; ',;   '`          `',   ,'`          `'   ;,' ;              |
X        )  ; ;`,`',  _--~~~~--__   ' '   __--~~~~--_  ,'`,'; ;     )       X
|       (    ; `,' ; :  /       \~~-___-~~/       \  : ; ',' ;     (        |
X  )     )   )',  ;   -_\  o    /  '   '  \    o  /_-   ;  ,'       )   (   X
| (     (   (   `;      ~-____--~'       '~--____-~      ;'  )     (     )  |
X  )     )   )   ;            ,`;,,,   ,,,;',            ;  (       )   (   X
| (     (   (  .  ;        ,'`  (__ '_' __)  `',        ;  . )     (     )  |
X  )     \/ ,".). ';    ,'`        ~~ ~~        `',    ;  .(.", \/  )   (   X
| (   , ,'|// / (/ ,;  '        _--~~-~~--_        '  ;, \)    \|', ,    )  |
X ,)  , \/ \|  \\,/  ;;       ,; |_| | |_| ;,       ;;  \,//  |/ \/ ,   ,   X
|",   .| \_ |\/ |#\_/;       ;_| : `~'~' : |_;       ;\_/#| \/| _/ |.   ,"  |
X#(,'  )  \\\#\ \##/)#;     :  `\/       \/   :     ;#(\##/ /#///  (  ',)# ,X
|| ) | \ |/ /#/ |#( \; ;     :               ;     ; ;/ )#| \#\ \| / | ( |) |
X\ |.\\ |\_/#| /#),,`   ;     ;./\_     _/\.;     ;   `,,(#\ |#\_/| //.| / ,X
| \\_/# |#\##/,,'`       ;     ~~--|~|~|--~~     ;       `',,\##/#| #\_// \/|
X  ##/#  #,,'`            ;        ~~~~~        ;            `',,#  #\##  //X
|####@,,'`                 `',               ,'`                 `',,@####| |
X#,,'`                        `',         ,'`                        `',,###X
|'                               ~~-----~~                               `' |
X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X-X*/

const INTERVAL_IN_MINUTES = 30

export const demon = () =>
  cron.schedule('* * * * *', () => {
    const bushes = getBushes()
    const now = new Date()
    bushes.forEach((bush) => {
      if (
        isBefore(
          add(new Date(bush.lastWatering), { hours: bush.wateringInterval }),
          now,
        ) &&
        isBefore(
          add(new Date(bush.lastNotification), {
            minutes: INTERVAL_IN_MINUTES,
          }),
          now,
        )
      ) {
        console.log(
          'Эй поливай',
          'Пора полить:',
          isBefore(
            add(new Date(bush.lastNotification), {
              minutes: INTERVAL_IN_MINUTES,
            }),
            now,
          ),
          'Пора напомнить:',
          isBefore(
            add(new Date(bush.lastNotification), {
              minutes: INTERVAL_IN_MINUTES,
            }),
            now,
          ),
        )
        sendNotification(bush.id)
      }
    })
  })
