import { ActivityIndicator, View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, TextInput } from "react-native";
import { useFonts, PixelifySans_400Regular } from '@expo-google-fonts/pixelify-sans';
import { useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

const { width, height } = Dimensions.get('window');

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <ScrollView style={styles.templeContainer}>
      <View style={styles.templeHeader}>
        <Text style={styles.templeTitle}>HOLY GAMES</Text>
        <Text style={styles.templeSubtitle}>BLESSINGS FROM THE HOLY CODER</Text>
        <Image 
          source={require("./assets/imgs/holygames.jpg")} 
          style={styles.templeLogo} 
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.templeMessage}>
        <Text style={styles.templeText}>
          🕊️ WELCOME TO THE HOLY REALM OF GAMES! 🕊️
        </Text>
        <Text style={styles.templeText}>
          These games are blessed by the divine algorithm!
        </Text>
        <Text style={styles.templeText}>
          May your scores be high and your bugs be few!
        </Text>
        <Text style={styles.templeText}>
          Press the sacred button to begin your holy journey!
        </Text>
      </View>
      
      <TouchableOpacity style={styles.templeButton} onPress={onStart}>
        <Text style={styles.templeButtonText}>▶ BEGIN HOLY QUEST ◀</Text>
      </TouchableOpacity>
      
      <View style={styles.templeFooter}>
        <Text style={styles.templeSignature}>Created by Berdia, Servant of the Code</Text>
        <Text style={styles.templeBlessing}>May God bless your gaming session! 🙏</Text>
      </View>
    </ScrollView>
  );
}
function SoloOrDuo({ onSelectMode }: { onSelectMode: (mode: 'solo' | 'duo') => void }) {
  return (
    <View style={styles.templeContainer}>
      <Text style={styles.templeTitle}>CHOOSE YOUR PATH</Text>
      <Text style={styles.templeSubtitle}>Solo or with a companion?</Text>
      
      <View style={styles.templeChoiceContainer}>
        <TouchableOpacity style={styles.templeChoiceButton} onPress={() => onSelectMode('solo')}>
          <Image source={require("./assets/imgs/solo.png")} style={styles.choiceIcon} />
          <Text style={styles.templeChoiceText}>SOLO JOURNEY</Text>
          <Text style={styles.templeChoiceSubtext}>Walk alone with God</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.templeChoiceButton} onPress={() => onSelectMode('duo')}>
          <Image source={require("./assets/imgs/duo.png")} style={styles.choiceIcon} />
          <Text style={styles.templeChoiceText}>DUO QUEST</Text>
          <Text style={styles.templeChoiceSubtext}>Share the blessing</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function GameSelect({ onSelectGame }: { onSelectGame: (game: string) => void }) {
  return (
    <ScrollView style={styles.templeContainer}>
      <Text style={styles.templeTitle}>SELECT THY HOLY GAME</Text>
      <Text style={styles.templeSubtitle}>Choose wisely, for each game holds divine purpose!</Text>
      
      <View style={styles.templeGameGrid}>
        <TouchableOpacity style={styles.templeGameButton} onPress={() => onSelectGame('carAway')}>
          <Image source={require("./assets/imgs/soloCar.png")} style={styles.gameIcon} />
          <Text style={styles.templeGameTitle}>CAR AWAY</Text>
          <Text style={styles.templeGameDesc}>Dodge obstacles on the holy road!</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.templeGameButton} onPress={() => onSelectGame('dodger')}>
          <Image source={require("./assets/imgs/laser.png")} style={styles.gameIcon} />
          <Text style={styles.templeGameTitle}>DODGER</Text>
          <Text style={styles.templeGameDesc}>Avoid the dangers of the digital realm!</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.templeGameButton} onPress={() => onSelectGame('primeGuess')}>
          <Image source={require("./assets/imgs/danger.png")} style={styles.gameIcon} />
          <Text style={styles.templeGameTitle}>PRIME GUESS</Text>
          <Text style={styles.templeGameDesc}>Discern prime numbers in holy wisdom!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function CarAway({ onEndGame, gameMode, playSound }: { onEndGame: (score: number) => void, gameMode: 'solo' | 'duo', playSound: (sound: string) => void }) {
  const [playerX, setPlayerX] = useState(width / 2 - 25);
  const [player2X, setPlayer2X] = useState(width / 2 + 25);
  const [obstacles, setObstacles] = useState<{x: number, y: number, type: 'obstacle' | 'boost'}[]>([]);
  const [score, setScore] = useState(0);
  const [roadImage, setRoadImage] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const roadTimer = useRef<NodeJS.Timeout | number | null>(null);

  useEffect(() => {
    roadTimer.current = setInterval(() => {
      setRoadImage(prev => prev === 1 ? 2 : 1);
    }, 3000);

    return () => {
      if (roadTimer.current) clearInterval(roadTimer.current);
    };
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      if (!gameOver) {
        setObstacles(prev => prev.map(obs => ({ ...obs, y: obs.y + 8 })).filter(obs => obs.y < height + 60));
        
        if (Math.random() < 0.03) {
          const type = Math.random() < 0.3 ? 'boost' : 'obstacle';
          // spawn at top
          setObstacles(prev => [...prev, { x: Math.random() * (width - 60), y: 0, type }]);
        }
        
        obstacles.forEach(obs => {
          if (obs.y > height - 120 && obs.y < height - 70) {
            if (obs.x < playerX + 80 && obs.x + 50 > playerX) {
              if (obs.type === 'obstacle') {
                playSound('hitHurt.wav');
                setGameOver(true);
              } else if (obs.type === 'boost') {
                playSound('powerUp.wav');
                setScore(prev => prev + 50);
                setObstacles(prev => prev.filter(o => o !== obs));
              }
            }
            if (gameMode === 'duo' && obs.x < player2X + 80 && obs.x + 50 > player2X) {
              if (obs.type === 'obstacle') {
                playSound('hitHurt.wav');
                setGameOver(true);
              } else if (obs.type === 'boost') {
                playSound('powerUp.wav');
                setScore(prev => prev + 50);
                setObstacles(prev => prev.filter(o => o !== obs));
              }
            }
          }
        });
        
        setScore(prev => Math.min(prev + 1, 999999));
      }
    }, 50);
    
    return () => clearInterval(gameLoop);
  }, [obstacles, playerX, player2X, gameOver, gameMode, playSound]);

  useEffect(() => {
    if (gameOver) {
      if (roadTimer.current) clearInterval(roadTimer.current);
      setTimeout(() => onEndGame(score), 2000);
    }
  }, [gameOver, score, onEndGame]);

  const moveLeft1 = () => {
    setPlayerX(prev => Math.max(0, prev - 30));
  };

  const moveRight1 = () => {
    setPlayerX(prev => Math.min(width - 80, prev + 30));
  };

  const moveLeft2 = () => {
    setPlayer2X(prev => Math.max(0, prev - 30));
  };

  const moveRight2 = () => {
    setPlayer2X(prev => Math.min(width - 80, prev + 30));
  };

  const handleMove = (event: any) => {
    if (gameOver) return;
    const touchX = event.nativeEvent.locationX;
    const touchY = event.nativeEvent.locationY;
    
    if (gameMode === 'duo') {
      if (touchY < height / 2) {
        setPlayerX(Math.max(0, Math.min(width - 80, touchX - 40)));
      } else {
        setPlayer2X(Math.max(0, Math.min(width - 80, touchX - 40)));
      }
    } else {
      setPlayerX(Math.max(0, Math.min(width - 80, touchX - 40)));
    }
  };

  return (
    <View style={styles.gameContainer}>
      <Image 
        source={roadImage === 1 ? require("./assets/imgs/road1.png") : require("./assets/imgs/road2.png")}
        style={styles.roadBackground}
        resizeMode="cover"
      />
      
      <View style={styles.gameHUD}>
        <Text style={styles.templeScore}>SCORE: {score}</Text>
        <Text style={styles.templeRoad}>ROAD {roadImage}</Text>
        <Text style={styles.templeMode}>{gameMode.toUpperCase()}</Text>
      </View>
      
      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.templeGameOver}>HOLY CAR CRASH!</Text>
          <Text style={styles.templeFinalScore}>Final Score: {score}</Text>
        </View>
      )}
      
      <Image
        source={require("./assets/imgs/soloCar.png")}
        style={[styles.playerCarImage, { left: playerX }]}
        resizeMode="contain"
      />
      
      {gameMode === 'duo' && (
        <Image
          source={require("./assets/imgs/duoCar.png")}
          style={[styles.playerCarImage, { left: player2X, top: height - 200 }]}
          resizeMode="contain"
        />
      )}
      
      {obstacles.map((obs, index) => (
        <Image
          key={index}
          source={obs.type === 'obstacle' ? require("./assets/imgs/obstacle.png") : require("./assets/imgs/boost.png")}
          style={[styles.gameObstacle, { left: obs.x, top: obs.y }]}
          resizeMode="contain"
        />
      ))}
      
      <TouchableOpacity style={styles.templeEndButton} onPress={() => onEndGame(score)}>
        <Text style={styles.templeEndButtonText}>END HOLY DRIVE</Text>
      </TouchableOpacity>
      
      {gameMode === 'duo' ? (
        <View style={styles.duoControlButtons}>
          <View style={styles.playerControlSection}>
            <TouchableOpacity style={styles.carControlButton} onPress={moveLeft1}>
              <Text style={styles.carControlButtonText}>◀ P1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.carControlButton} onPress={moveRight1}>
              <Text style={styles.carControlButtonText}>P1 ▶</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.playerControlSection}>
            <TouchableOpacity style={styles.carControlButton} onPress={moveLeft2}>
              <Text style={styles.carControlButtonText}>◀ P2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.carControlButton} onPress={moveRight2}>
              <Text style={styles.carControlButtonText}>P2 ▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.carControlButtons}>
          <TouchableOpacity style={styles.carControlButton} onPress={moveLeft1}>
            <Text style={styles.carControlButtonText}>◀ LEFT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.carControlButton} onPress={moveRight1}>
            <Text style={styles.carControlButtonText}>RIGHT ▶</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {/* touchArea removed so control buttons are clickable */}
    </View>
  );
}

function PrimeGuess({ onEndGame, playSound }: { onEndGame: (score: number) => void, playSound: (sound: string) => void }) {
  const [number, setNumber] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    generateNewNumber();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !gameEnded) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameEnded) {
      setGameEnded(true);
      onEndGame(score);
    }
  }, [timeLeft, score, onEndGame, gameEnded]);

  const generateNewNumber = () => {
    if (gameEnded) return;
    const newNum = Math.floor(Math.random() * 100) + 1;
    setNumber(newNum);
  };

  const handleGuess = (guess: boolean) => {
    if (gameEnded) return;
    const correct = isPrime(number) === guess;
    if (correct) {
      playSound('powerUp.wav');
      setScore(score + 10);
    } else {
      playSound('hitHurt.wav');
    }
    generateNewNumber();
  };

  return (
    <View style={styles.templeContainer}>
      <Text style={styles.templeTitle}>PRIME GUESS</Text>
      <Text style={styles.templeTimer}>HOLY TIME: {timeLeft}s</Text>
      <Text style={styles.templeScore}>SCORE: {score}</Text>
      
      {!gameEnded && (
        <>
          <Text style={styles.templeNumber}>{number}</Text>
          <Text style={styles.templeQuestion}>Is this number prime?</Text>
          <View style={styles.templeButtonContainer}>
            <TouchableOpacity style={styles.templeYesButton} onPress={() => handleGuess(true)}>
              <Text style={styles.templeButtonText}>YES ✓</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.templeNoButton} onPress={() => handleGuess(false)}>
              <Text style={styles.templeButtonText}>NO ✗</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      
      {gameEnded && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.templeGameOver}>TIME'S UP!</Text>
          <Text style={styles.templeFinalScore}>Final Score: {score}</Text>
        </View>
      )}
      
      <TouchableOpacity style={styles.templeEndButton} onPress={() => onEndGame(score)}>
        <Text style={styles.templeEndButtonText}>END PRIME QUEST</Text>
      </TouchableOpacity>
    </View>
  );
}

function Dodger({ onEndGame, playSound, gameMode }: { onEndGame: (score: number) => void, playSound: (sound: string) => void, gameMode: 'solo' | 'duo' }) {
  const [playerX, setPlayerX] = useState(width / 2 - 40);
  const [player2X, setPlayer2X] = useState(width / 2 + 40);
  const [lasers, setLasers] = useState<{x: number, y: number, vx: number, id: number}[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const laserIdRef = useRef(0);
  const gameLoopRef = useRef<NodeJS.Timeout | number | null>(null);

  useEffect(() => {
    gameLoopRef.current = setInterval(() => {
      if (!gameOver) {
        setLasers(prev => {
          const updated = prev.map(laser => ({ ...laser, x: laser.x + laser.vx, y: laser.y + 8 }))
            .filter(laser => laser.y < height && laser.x >= 0 && laser.x <= width);
          
          if (Math.random() < 0.08) {
            const vx = (Math.random() * 6) - 3; // horizontal velocity between -3 and 3
            const newLaser = {
              x: width / 2 - 15,
              y: 80,
              vx,
              id: laserIdRef.current++
            };
            return [...updated, newLaser];
          }
          
          return updated;
        });

        setScore(prev => Math.min(prev + 1, 999999));
      }
    }, 50);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameOver]);

  useEffect(() => {
    lasers.forEach(laser => {
      if (laser.y > height - 150 && laser.y < height - 50 &&
          laser.x < playerX + 80 && laser.x + 30 > playerX) {
        playSound('hitHurt.wav');
        setGameOver(true);
      }
    });
  }, [lasers, playerX, playSound]);

  useEffect(() => {
    if (gameOver) {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
      setTimeout(() => onEndGame(score), 2000);
    }
  }, [gameOver, score, onEndGame]);

  const handleMove = (player: 1 | 2, direction: 'left' | 'right') => {
    if (gameOver) return;
    if (player === 1) {
      setPlayerX(prev => {
        if (direction === 'left') return Math.max(0, prev - 25);
        else return Math.min(width - 80, prev + 25);
      });
    } else {
      setPlayer2X(prev => {
        if (direction === 'left') return Math.max(0, prev - 25);
        else return Math.min(width - 80, prev + 25);
      });
    }
  };

  return (
    <View style={styles.gameContainer}>
      <View style={styles.blackBackground} />
      
      <View style={styles.gameHUD}>
        <Text style={styles.templeScore}>SCORE: {score}</Text>
        <Text style={styles.templeRoad}>BOSS FIGHT</Text>
      </View>
      
      {gameOver && (
        <View style={styles.gameOverOverlay}>
          <Text style={styles.templeGameOver}>DEFEATED BY THE BOSS!</Text>
          <Text style={styles.templeFinalScore}>Final Score: {score}</Text>
        </View>
      )}
      
      <Image
        source={require("./assets/imgs/opponent.png")}
        style={styles.bossImageTop}
        resizeMode="contain"
      />
      
      {lasers.map((laser) => (
        <Image
          key={laser.id}
          source={require("./assets/imgs/laser.png")}
          style={[styles.laserImage, { left: laser.x, top: laser.y }]}
          resizeMode="contain"
        />
      ))}
      
      <Image
        source={require("./assets/imgs/solo.png")}
        style={[styles.playerHeart, { left: playerX }]}
        resizeMode="contain"
      />
      {gameMode === 'duo' && (
        <Image
          source={require("./assets/imgs/duo.png")}
          style={[styles.playerHeart, { left: player2X, top: height - 160 }]}
          resizeMode="contain"
        />
      )}
      
      <TouchableOpacity style={styles.templeEndButton} onPress={() => onEndGame(score)}>
        <Text style={styles.templeEndButtonText}>END HOLY DODGE</Text>
      </TouchableOpacity>
      
      {gameMode === 'duo' ? (
        <View style={styles.duoControlButtons}>
          <View style={styles.playerControlSection}>
            <TouchableOpacity style={styles.carControlButton} onPress={() => handleMove(1, 'left')}>
              <Text style={styles.carControlButtonText}>◀ P1</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.carControlButton} onPress={() => handleMove(1, 'right')}>
              <Text style={styles.carControlButtonText}>P1 ▶</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.playerControlSection}>
            <TouchableOpacity style={styles.carControlButton} onPress={() => handleMove(2, 'left')}>
              <Text style={styles.carControlButtonText}>◀ P2</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.carControlButton} onPress={() => handleMove(2, 'right')}>
              <Text style={styles.carControlButtonText}>P2 ▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.dodgerControlButtons}>
          <TouchableOpacity style={styles.carControlButton} onPress={() => handleMove(1, 'left')}>
            <Text style={styles.carControlButtonText}>◀ LEFT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.carControlButton} onPress={() => handleMove(1, 'right')}>
            <Text style={styles.carControlButtonText}>RIGHT ▶</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

function Report({ score, onBackHome }: { score: number, onBackHome: () => void }) {
  const [showReport, setShowReport] = useState(false);
  const [reportText, setReportText] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const submitReport = async () => {
    try {
      console.log('Holy Report:', reportText);
      setReportSubmitted(true);
      setTimeout(() => {
        setShowReport(false);
        setReportText('');
        setReportSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to submit report:', error);
    }
  };

  return (
    <ScrollView style={styles.templeContainer}>
      <Text style={styles.templeTitle}>HOLY SCORECARD</Text>
      <Text style={styles.templeScore}>THY SCORE: {score}</Text>
      
      <View style={styles.templeBlessings}>
        <Text style={styles.templeBlessing}>May thy score be blessed!</Text>
        <Text style={styles.templeBlessing}>🙏 Amen 🙏</Text>
      </View>
      
      {!showReport && (
        <TouchableOpacity style={styles.templeReportButton} onPress={() => setShowReport(true)}>
          <Text style={styles.templeReportButtonText}>REPORT A PROBLEM</Text>
        </TouchableOpacity>
      )}
      
      {showReport && !reportSubmitted && (
        <View style={styles.reportForm}>
          <Text style={styles.templeReportTitle}>HOLY REPORT FORM</Text>
          <Text style={styles.templeReportDesc}>Tell us about the issue, blessed gamer:</Text>
          <TextInput
            style={styles.reportInput}
            multiline
            placeholder="Describe the holy problem..."
            value={reportText}
            onChangeText={setReportText}
            placeholderTextColor="#666"
          />
          <View style={styles.reportButtons}>
            <TouchableOpacity style={styles.templeSubmitButton} onPress={submitReport}>
              <Text style={styles.templeSubmitButtonText}>SUBMIT REPORT</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.templeCancelButton} onPress={() => setShowReport(false)}>
              <Text style={styles.templeCancelButtonText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {reportSubmitted && (
        <View style={styles.reportSuccess}>
          <Text style={styles.templeSuccessText}>REPORT SUBMITTED!</Text>
          <Text style={styles.templeSuccessSubtext}>Thank you for helping improve the holy games!</Text>
        </View>
      )}
      
      <TouchableOpacity style={styles.templeHomeButton} onPress={onBackHome}>
        <Text style={styles.templeHomeButtonText}>RETURN TO HOLY MENU</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function isPrime(num: number): boolean {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
}

type Screen = 'welcome' | 'soloOrDuo' | 'gameSelect' | 'carAway' | 'primeGuess' | 'dodger' | 'report';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Pixelify': PixelifySans_400Regular,
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [finalScore, setFinalScore] = useState(0);
  const [gameMode, setGameMode] = useState<'solo' | 'duo'>('solo');

  const playSound = async (soundFile: string) => {
    try {
      let soundSource;
      switch (soundFile) {
        case 'start.wav':
          soundSource = require('./assets/sounds/start.wav');
          break;
        case 'hitHurt.wav':
          soundSource = require('./assets/sounds/hitHurt.wav');
          break;
        case 'powerUp.wav':
          soundSource = require('./assets/sounds/powerUp.wav');
          break;
        case 'laserShoot.wav':
          soundSource = require('./assets/sounds/laserShoot.wav');
          break;
        default:
          return;
      }
      
      const { sound } = await Audio.Sound.createAsync(soundSource);
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync();
        }
      });
    } catch (error) {
      console.log('Error playing sound:', error);
    }
  };

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000000", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  const handleStart = () => {
    playSound('start.wav');
    setCurrentScreen('soloOrDuo');
  };
  const handleSelectMode = (mode: 'solo' | 'duo') => {
    setGameMode(mode);
    setCurrentScreen('gameSelect');
  };
  const handleSelectGame = (game: string) => {
    if (game === 'carAway') setCurrentScreen('carAway');
    else if (game === 'dodger') setCurrentScreen('dodger');
    else if (game === 'primeGuess') setCurrentScreen('primeGuess');
  };
  const handleEndGame = (score: number) => {
    setFinalScore(score);
    setCurrentScreen('report');
  };
  const handleBackHome = () => {
    setCurrentScreen('welcome');
    setFinalScore(0);
  };

  return (
    <View style={{ backgroundColor: "#000000", flex: 1 }}>
      {currentScreen === 'welcome' && <Welcome onStart={handleStart} />}
      {currentScreen === 'soloOrDuo' && <SoloOrDuo onSelectMode={handleSelectMode} />}
      {currentScreen === 'gameSelect' && <GameSelect onSelectGame={handleSelectGame} />}
      {currentScreen === 'carAway' && <CarAway onEndGame={handleEndGame} gameMode={gameMode} playSound={playSound} />}
      {currentScreen === 'primeGuess' && <PrimeGuess onEndGame={handleEndGame} playSound={playSound} />}
      {currentScreen === 'dodger' && <Dodger onEndGame={handleEndGame} playSound={playSound} gameMode={gameMode} />}
      {currentScreen === 'report' && <Report score={finalScore} onBackHome={handleBackHome} />}
      
      <View style={styles.bottomDecoration}>
        <Text style={styles.bottomText}>HOLY GAMES - BLESSED BY THE CODE</Text>
        <Text style={styles.bottomSubtext}>May your pixels be forever blessed 🙏</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  templeContainer: {
    flex: 1,
    backgroundColor: "#001122",
    padding: 20,
  },
  templeHeader: {
    alignItems: "center",
    marginBottom: 30,
    borderWidth: 3,
    borderColor: "#ffdd00",
    backgroundColor: "#002244",
    padding: 20,
    borderRadius: 10,
  },
  templeTitle: {
    color: "#ffdd00",
    fontSize: 28,
    textAlign: "center",
    fontFamily: "Pixelify",
    textShadowColor: "#ff0000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
    marginBottom: 10,
  },
  templeSubtitle: {
    color: "#00ffff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Pixelify",
    marginBottom: 15,
  },
  templeLogo: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: "#ffdd00",
  },
  templeMessage: {
    backgroundColor: "#003366",
    borderWidth: 2,
    borderColor: "#00ff00",
    padding: 20,
    borderRadius: 8,
    marginBottom: 30,
  },
  templeText: {
    color: "#ffffff",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "Pixelify",
    lineHeight: 24,
    marginBottom: 10,
  },
  templeButton: {
    backgroundColor: "#ffdd00",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: "#ff0000",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  templeButtonText: {
    color: "#000000",
    fontSize: 18,
    fontFamily: "Pixelify",
    textAlign: "center",
    fontWeight: "bold",
  },
  templeFooter: {
    alignItems: "center",
    marginTop: 20,
  },
  templeSignature: {
    color: "#888888",
    fontSize: 12,
    fontFamily: "Pixelify",
    textTransform: "uppercase",
  },
  templeBlessing: {
    color: "#ffff00",
    fontSize: 14,
    fontFamily: "Pixelify",
    textAlign: "center",
    marginTop: 5,
  },
  
  templeChoiceContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 30,
  },
  templeChoiceButton: {
    backgroundColor: "#004477",
    borderWidth: 2,
    borderColor: "#00ffff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "40%",
  },
  choiceIcon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  templeChoiceText: {
    color: "#ffdd00",
    fontSize: 16,
    fontFamily: "Pixelify",
    textAlign: "center",
    fontWeight: "bold",
  },
  templeChoiceSubtext: {
    color: "#ffffff",
    fontSize: 12,
    fontFamily: "Pixelify",
    textAlign: "center",
  },
  
  templeGameGrid: {
    marginTop: 30,
  },
  templeGameButton: {
    backgroundColor: "#005588",
    borderWidth: 2,
    borderColor: "#ff6600",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
  },
  gameIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  templeGameTitle: {
    color: "#ffdd00",
    fontSize: 18,
    fontFamily: "Pixelify",
    textAlign: "center",
    fontWeight: "bold",
  },
  templeGameDesc: {
    color: "#00ff00",
    fontSize: 14,
    fontFamily: "Pixelify",
    textAlign: "center",
  },
  
  gameContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  roadBackground: {
    position: "absolute",
    width: width,
    height: height,
    top: 0,
    left: 0,
  },
  blackBackground: {
    position: "absolute",
    width: width,
    height: height,
    top: 0,
    left: 0,
    backgroundColor: "#000000",
  },
  bossImageTop: {
    position: "absolute",
    top: 20,
    left: width / 2 - 50,
    width: 100,
    height: 100,
  },
  laserImage: {
    position: "absolute",
    width: 30,
    height: 40,
  },
  gameHUD: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  templeScore: {
    color: "#ffdd00",
    fontSize: 24,
    fontFamily: "Pixelify",
    fontWeight: "bold",
    textShadowColor: "#000000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  templeRoad: {
    color: "#00ffff",
    fontSize: 20,
    fontFamily: "Pixelify",
  },
  templeSpeed: {
    color: "#ff6600",
    fontSize: 20,
    fontFamily: "Pixelify",
  },
  gameOverOverlay: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "rgba(255, 0, 0, 0.8)",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  templeGameOver: {
    color: "#ffffff",
    fontSize: 32,
    fontFamily: "Pixelify",
    textAlign: "center",
    marginBottom: 10,
  },
  templeFinalScore: {
    color: "#ffdd00",
    fontSize: 24,
    fontFamily: "Pixelify",
    textAlign: "center",
  },
  playerCarImage: {
    position: "absolute",
    bottom: 100,
    width: 80,
    height: 80,
  },
  templeMode: {
    color: "#00ffff",
    fontSize: 20,
    fontFamily: "Pixelify",
  },
  gameObstacle: {
    position: "absolute",
    width: 50,
    height: 50,
  },
  touchArea: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height - 100,
  },
  carControlButtons: {
    position: "absolute",
    bottom: 160,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
  },
  carControlButton: {
    backgroundColor: "#004477",
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#00ffff",
  },
  carControlButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Pixelify",
  },
  duoControlButtons: {
    position: "absolute",
    bottom: 160,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  playerControlSection: {
    flexDirection: "row",
    gap: 10,
  },
  dodgerControlButtons: {
    position: "absolute",
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 50,
    zIndex: 100,
  },
  templeEndButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#ff0000",
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  templeEndButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Pixelify",
    textAlign: "center",
    fontWeight: "bold",
  },
  
  templeTimer: {
    color: "#ff0000",
    fontSize: 24,
    fontFamily: "Pixelify",
    textAlign: "center",
    marginBottom: 10,
  },
  templeNumber: {
    color: "#00ff00",
    fontSize: 64,
    fontFamily: "Pixelify",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "#000000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
  templeQuestion: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Pixelify",
    textAlign: "center",
    marginBottom: 30,
  },
  templeButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 40,
  },
  templeYesButton: {
    backgroundColor: "#00ff00",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  templeNoButton: {
    backgroundColor: "#ff0000",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#ffffff",
  },
  
  templeBlessings: {
    alignItems: "center",
    marginVertical: 30,
    padding: 20,
    backgroundColor: "#004400",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#00ff00",
  },
  templeReportButton: {
    backgroundColor: "#ff6600",
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#ffffff",
    marginBottom: 20,
  },
  templeReportButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Pixelify",
    textAlign: "center",
  },
  reportForm: {
    backgroundColor: "#333333",
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#ffdd00",
    marginBottom: 20,
  },
  templeReportTitle: {
    color: "#ffdd00",
    fontSize: 20,
    fontFamily: "Pixelify",
    textAlign: "center",
    marginBottom: 10,
  },
  templeReportDesc: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Pixelify",
    textAlign: "center",
    marginBottom: 15,
  },
  reportInput: {
    backgroundColor: "#555555",
    borderWidth: 1,
    borderColor: "#ffffff",
    borderRadius: 5,
    padding: 10,
    color: "#ffffff",
    fontFamily: "Pixelify",
    fontSize: 16,
    height: 100,
    textAlignVertical: "top",
  },
  reportButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  templeSubmitButton: {
    backgroundColor: "#00ff00",
    padding: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  templeSubmitButtonText: {
    color: "#000000",
    fontSize: 14,
    fontFamily: "Pixelify",
    fontWeight: "bold",
  },
  templeCancelButton: {
    backgroundColor: "#ff0000",
    padding: 12,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  templeCancelButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Pixelify",
    fontWeight: "bold",
  },
  reportSuccess: {
    backgroundColor: "#004400",
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#00ff00",
    alignItems: "center",
    marginBottom: 20,
  },
  templeSuccessText: {
    color: "#00ff00",
    fontSize: 20,
    fontFamily: "Pixelify",
    textAlign: "center",
    marginBottom: 10,
  },
  templeSuccessSubtext: {
    color: "#ffffff",
    fontSize: 14,
    fontFamily: "Pixelify",
    textAlign: "center",
  },
  templeHomeButton: {
    backgroundColor: "#004477",
    padding: 15,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#00ffff",
  },
  templeHomeButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Pixelify",
    textAlign: "center",
    fontWeight: "bold",
  },
  
  outsideWrapper: {
    alignSelf: "center",
    width: "95%",
    maxWidth: 420,
    marginVertical: 20,
  },
  bigPixelBox: {
    backgroundColor: "#2e2e2e",
    borderWidth: 5,
    borderColor: "#ffffff",
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 12,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#f6de5f",
  },
  title: {
    color: "#f6de5f",
    fontSize: 22,
    textAlign: "center",
    fontFamily: "Pixelify",
    lineHeight: 30,
  },
  thickDivider: {
    width: "100%",
    height: 6,
    backgroundColor: "#ffffff",
    marginVertical: 20,
  },
  description: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "Pixelify",
    lineHeight: 24,
    marginBottom: 25,
  },
  startButton: {
    backgroundColor: "#f6de5f",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
  },
  startButtonText: {
    color: "#000000",
    fontSize: 18,
    fontFamily: "Pixelify",
    textAlign: "center",
    fontWeight: "bold",
  },
  footer: {
    width: "100%",
    alignItems: "flex-end",
  },
  signature: {
    color: "#888888",
    fontSize: 10,
    fontFamily: "Pixelify",
    textTransform: "uppercase",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  button: {
    backgroundColor: "#f6de5f",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#000000",
    fontSize: 18,
    fontFamily: "Pixelify",
    fontWeight: "bold",
  },
  score: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "Pixelify",
    marginBottom: 20,
  },
  tapArea: {
    backgroundColor: "#2e2e2e",
    padding: 50,
    borderRadius: 10,
    marginBottom: 40,
  },
  tapText: {
    color: "#f6de5f",
    fontSize: 18,
    fontFamily: "Pixelify",
  },
  endButton: {
    backgroundColor: "#f6de5f",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  endButtonText: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "Pixelify",
    fontWeight: "bold",
  },
  timer: {
    color: "#ff0000",
    fontSize: 18,
    fontFamily: "Pixelify",
    marginBottom: 10,
  },
  number: {
    color: "#f6de5f",
    fontSize: 48,
    fontFamily: "Pixelify",
    marginBottom: 10,
  },
  question: {
    color: "#ffffff",
    fontSize: 16,
    fontFamily: "Pixelify",
    marginBottom: 30,
  },
  yesButton: {
    backgroundColor: "#00ff00",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  noButton: {
    backgroundColor: "#ff0000",
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10,
  },
  gameOver: {
    color: "#ff0000",
    fontSize: 32,
    fontFamily: "Pixelify",
    textAlign: "center",
    marginBottom: 20,
  },
  player: {
    position: "absolute",
    bottom: 100,
    width: 50,
    height: 50,
    backgroundColor: "#f6de5f",
    borderRadius: 25,
  },
  playerHeart: {
    position: "absolute",
    bottom: 100,
    width: 80,
    height: 80,
  },
  bossImage: {
    position: "absolute",
    width: 100,
    height: 100,
  },
  obstacle: {
    position: "absolute",
    width: 50,
    height: 50,
    backgroundColor: "#ff0000",
    borderRadius: 5,
  },
  homeButton: {
    backgroundColor: "#f6de5f",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  homeButtonText: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "Pixelify",
    fontWeight: "bold",
  },
  bottomDecoration: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#001122",
    padding: 10,
    borderTopWidth: 2,
    borderTopColor: "#ffdd00",
    alignItems: "center",
  },
  bottomText: {
    color: "#ffdd00",
    fontSize: 12,
    fontFamily: "Pixelify",
    textAlign: "center",
  },
  bottomSubtext: {
    color: "#00ffff",
    fontSize: 10,
    fontFamily: "Pixelify",
    textAlign: "center",
    marginTop: 2,
  },
  controlButtons: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  controlButton: {
    backgroundColor: "#f6de5f",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#000000",
  },
  controlButtonText: {
    color: "#000000",
    fontSize: 16,
    fontFamily: "Pixelify",
    fontWeight: "bold",
  },
});