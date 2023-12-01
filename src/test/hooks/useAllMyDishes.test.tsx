import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { renderHook, act } from '@testing-library/react';
import { useAllMyDishes } from '../../hooks/useAllMyDishes';

// axiosのモックを作成
const mock = new MockAdapter(axios);

// テスト用のデータ
const testData = [{ id: 1, name: 'Test Dish' , genre_id: 1, category_id: 1, description: 'Test Description', reference_url: 'https://example.com'}];

describe('useAllMyDishes', () => {
  afterEach(() => {
    // 各テストの後にaxiosのモックをリセット
    mock.reset();
  });

  it('should fetch dishes on getDishes', async () => {
    // axiosのモックの設定
    mock.onGet('http://localhost:8000/api/all-my-dish').reply(200, { dishes: testData });

    // フックの初期化
    const { result } = renderHook(() => useAllMyDishes());

    // 非同期関数の呼び出し
    await act(async () => {
      await result.current.getDishes();
    });

    // テストのアサーション
    expect(result.current.dishes).toEqual(testData);
    expect(result.current.loading).toBeFalsy();
  });

  it('should fetch Japanese dishes on getJapanese', async () => {
    // axiosのモックの設定
    mock.onGet('http://localhost:8000/api/japanese/').reply(200, testData);

    // フックの初期化
    const { result } = renderHook(() => useAllMyDishes());

    // 非同期関数の呼び出し
    await act(async () => {
      await result.current.getJapanese();
    });

    // テストのアサーション
    expect(result.current.dishes).toEqual(testData);
    expect(result.current.loading).toBeFalsy();
  });

    it('should fetch JapaneseSyusai dishes on getJapaneseSyusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/japanese_syusai/').reply(200, testData);
    
        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());
    
        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getJapaneseSyusai();
        });
    
        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
    });

    it('should fetch JapaneseFukusai dishes on getJapaneseFukusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/japanese_fukusai/').reply(200, testData);
    
        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());
    
        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getJapaneseFukusai();
        });
    
        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
    });

    it('should fetch JapaneseShirumono dishes on getJapaneseShirumono', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/japanese_shirumono/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getJapaneseShirumono();
        }
        );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }
    );


        it('should fetch JapaneseOthers dishes on getJapaneseOthers', async () => {
            // axiosのモックの設定
            mock.onGet('http://localhost:8000/api/japanese_others/').reply(200, testData);
    
            // フックの初期化
            const { result } = renderHook(() => useAllMyDishes());
    
            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getJapaneseOthers();
            }
            );


        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }
    );


    it('should set error on getDishes', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/all-my-dish').reply(500);
    
        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());
    
        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getDishes();
        });
    
        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
      });

    it('should set error on getJapanese', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/japanese/').reply(500);
    
        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());
    
        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getJapanese();
        });
    
        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }
    );

    it('should set error on getJapaneseSyusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/japanese_syusai/').reply(500);
    
        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());
    
        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getJapaneseSyusai();
        });
    
        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }
    );
        
    it('should set error on getJapaneseFukusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/japanese_fukusai/').reply(500);
    
        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());
    
        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getJapaneseFukusai();
        });
    
        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }
    );

    it('should set error on getJapaneseShirumono', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/japanese_shirumono/').reply(500);
    
        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());
    
        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getJapaneseShirumono();
        });
    
        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }
    );

    it('should set error on getJapaneseOthers', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/japanese_others/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getJapaneseOthers();
        }
        );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }
    );



         it('should fetch Western dishes on getWestern', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/western/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getWestern();
        }
        );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }
    );

    it('should fetch WesternSyusai dishes on getWesternSyusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/western_syusai/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getWesternSyusai();
        }
        );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }
    );

    it('should fetch WesternFukusai dishes on getWesternFukusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/western_fukusai/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getWesternFukusai();
        }
        );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }
    );

    it('should fetch WesternShirumono dishes on getWesternShirumono', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/western_shirumono/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getWesternShirumono();
        }
        );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }
    );

    it('should fetch WesternOthers dishes on getWesternOthers', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/western_others/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getWesternOthers();
        }
        );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }
    );


    it('should set error on getWestern', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/western/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getWestern();
        }
        );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }
    );

    it('should set error on getWesternSyusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/western_syusai/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getWesternSyusai();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }
    );

    it('should set error on getWesternFukusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/western_fukusai/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getWesternFukusai();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }
    );

    it('should set error on getWesternShirumono', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/western_shirumono/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getWesternShirumono();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }
    );

    it('should set error on getWesternOthers', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/western_others/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getWesternOthers();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }
    );



        
    it('should fetch Chinese dishes on getChinese', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/chinese/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getChinese();
        }
        );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }

    );

    it('should fetch ChineseSyusai dishes on getChineseSyusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/chinese_syusai/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getChineseSyusai();
        }
        );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }

    );

    it('should fetch ChineseFukusai dishes on getChineseFukusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/chinese_fukusai/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getChineseFukusai();
        }
        );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }

    );

    it('should fetch ChineseShirumono dishes on getChineseShirumono', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/chinese_shirumono/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
        await act(async () => {
        await result.current.getChineseShirumono();
        }
        );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }

    );

    it('should fetch ChineseOthers dishes on getChineseOthers', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/chinese_others/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getChineseOthers();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }

    );


    it('should set error on getChinese', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/Chinese/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getChinese();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }

    );

    it('should set error on getChineseSyusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/Chinese_syusai/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

        // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getChineseSyusai();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }

    );

    it('should set error on getChineseFukusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/Chinese_fukusai/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getChineseFukusai();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }

    );

    it('should set error on getChineseShirumono', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/Chinese_shirumono/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getChineseShirumono();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }

    );

    it('should set error on getChineseOthers', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/Chinese_others/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getChineseOthers();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }

    );


    it('should fetch Others dishes on getOthers', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/others/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getOthers();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }

    );

    
    it('should fetch OthersSyusai dishes on getOthersSyusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/others_syusai/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getOthersSyusai();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }

    );


    it('should fetch OthersFukusai dishes on getOthersFukusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/others_fukusai/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getOthersFukusai();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }

    );


    it('should fetch OthersShirumono dishes on getOthersShirumono', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/others_shirumono/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getOthersShirumono();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }

    );


    it('should fetch OthersOthers dishes on getOthersOthers', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/others_others/').reply(200, testData);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getOthersOthers();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual(testData);
        expect(result.current.loading).toBeFalsy();
        }

    );


    it('should set error on getOthers', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/Others/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getOthers();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }

    );


    it('should set error on getOthersSyusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/Others-syusai/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getOthersSyusai();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }

    );


    it('should set error on getOthersFukusai', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/Others-fukusai/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getOthersFukusai();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }

    );

        
    it('should set error on getOthersShirumono', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/others_shirumono/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getOthersShirumono();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }

    );


    it('should set error on getOthersOthers', async () => {
        // axiosのモックの設定
        mock.onGet('http://localhost:8000/api/others_others/').reply(500);

        // フックの初期化
        const { result } = renderHook(() => useAllMyDishes());

            // 非同期関数の呼び出し
            await act(async () => {
            await result.current.getOthersOthers();
            }
            );

        // テストのアサーション
        expect(result.current.dishes).toEqual([]);
        expect(result.current.loading).toBeFalsy();
        }

    );

}
);
