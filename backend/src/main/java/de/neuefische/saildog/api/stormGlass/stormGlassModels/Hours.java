package de.neuefische.saildog.api.stormGlass.stormGlassModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Hours {

    private String time;
    private WaveHeight waveHeight;
    private WindSpeed windSpeed;
}
