import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.AbstractMap;
import java.util.Arrays;


public class Audkenni {
	public static void main(String[] args) throws FileNotFoundException, IOException {
    
      // Tilgangurinn með forritinu er að skipta gömlum auðkennum vegpunkta fyrir ný
      // auðkenni, þannig að aðeins verði notast við jákvæðar heiltölur sem auðkenni.
			// Skráin tafla.txt inniheldur pör <gamalt auðkenni, nýtt auðkenni>, fyrir hvern punkt í mælipunktaskránni. 
      // Skráin gomulAudkenni.txt inniheldur gamla mælipunkta.
      
      BufferedReader brTafla = new BufferedReader(new FileReader(new File("tafla.txt")));
      BufferedReader brPunktar = new BufferedReader(new FileReader(new File("gomulAudkenni.txt")));
			
      // teljum línur í tafla.txt
      int tafla = 0;
      while(brTafla.readLine() != null) {
        tafla++;
      }
      System.out.println("Fjoldi punkta i vegpunktaskra: " + tafla);
      
      brTafla = new BufferedReader(new FileReader(new File("tafla.txt")));
      
      // búum til fylki lykla-gildis para þar sem lykillinn er gamla auðkennið og gildið er nýja auðkennið
			AbstractMap.SimpleEntry<String, String>[] idChangeTable = new AbstractMap.SimpleEntry[tafla];
			
      for(int i = 0; i < idChangeTable.length; i++) {
		  	String[] next = brTafla.readLine().split("\t");
        AbstractMap.SimpleEntry<String, String> pair = new AbstractMap.SimpleEntry<>(next[0], next[1]);
        idChangeTable[i] = pair;
      }
      
      // teljum línur í gomulAudkenni.txt
      int punktar = 0;
      while(brPunktar.readLine() != null) {
        punktar++;
      }
      System.out.println("Fjoldi uppfaerdra punkta: " + punktar);
      
      brPunktar = new BufferedReader(new FileReader(new File("gomulAudkenni.txt")));
      
      // búum til fylki undir auðkenni vegpunkta mælinga
      String[] ids = new String[punktar];
      
      for(int i = 0; i < ids.length; i++) {
        ids[i] = brPunktar.readLine();
      }
      
      // búum til fylki fyrir ný auðkenni
      String[] newIds = new String[punktar];
      
      // vitum (og gerum ráð fyrir) að vegpunktar allra mælinga séu á vegpunktaskrá
      // Notum línulega leit til að finna samsvarandi lykil fyrir vegpunktinn ids[i] 
      // í lykla-gildis fylkinu 
      for(int i = 0; i < ids.length; i++) {
        for(int j = 0; j < idChangeTable.length; j++) {
          if(ids[i].equals(idChangeTable[j].getKey())) {
            newIds[i] = idChangeTable[j].getValue();
            break;
          }
        }        
      }
      
      Iterable<String> iterable = Arrays.asList(newIds);
      
      // Skráin leidrettAudkenni.txt inniheldur ný auðkenni fyrir mælipunktana
      // Ath. Ef eitthvað auðkenni fær null-gildi merkir það að punkturinn er
      // ekki í vegpunktaskránni.
		  Path file = Paths.get("nyAudkenni.txt");
		  Files.write(file, iterable, Charset.forName("UTF-8"));		  
	}
}