package shop.tomashops.app;

import android.os.Bundle;
import androidx.core.splashscreen.SplashScreen;
import com.getcapacitor.BridgeActivity;
import io.capawesome.capacitorjs.plugins.androidedgetoedgesupport.EdgeToEdgePlugin;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        SplashScreen.installSplashScreen(this);
        registerPlugin(EdgeToEdgePlugin.class);
        super.onCreate(savedInstanceState);
    }
}
