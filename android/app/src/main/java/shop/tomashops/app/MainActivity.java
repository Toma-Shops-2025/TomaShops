package shop.tomashops.app;

import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import androidx.core.view.WindowCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        WindowCompat.enableEdgeToEdge(getWindow());
        SplashScreen.installSplashScreen(this);
        super.onCreate(savedInstanceState);
    }
}
